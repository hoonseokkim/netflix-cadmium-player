/**
 * Read-Write Lock
 *
 * Implements a readers-writer lock that allows multiple concurrent readers
 * or a single exclusive writer. Uses ticket-based queuing with optional
 * timeout support for both read and write lock acquisition.
 *
 * @module ReadWriteLock
 * @original Module_74015
 */

// import { MAX_TICKET_NUMBER } from './TicketConstants';
// import { asyncCallback } from './asyncCallback';
// import { MslInternalException } from './MslInternalException';

/**
 * A readers-writer lock supporting multiple concurrent readers
 * and exclusive write access with ticket-based queue management.
 */
export class ReadWriteLock {
    constructor() {
        /**
         * Map of active reader tickets
         * @type {Object<number, boolean>}
         */
        this.activeReaders = {};

        /**
         * Queued readers waiting for access
         * @type {Object<number, Function>}
         */
        this.pendingReaders = {};

        /**
         * Currently active writer ticket, or null
         * @type {number|null}
         */
        this.activeWriter = null;

        /**
         * Queued writers waiting for access
         * @type {Object<number, Function>}
         */
        this.pendingWriters = {};

        /**
         * Next reader queue cursor
         * @type {number}
         */
        this.nextReaderCursor = 0;

        /**
         * Next writer queue cursor
         * @type {number}
         */
        this.nextWriterCursor = 0;

        /**
         * Monotonically increasing ticket counter
         * @type {number}
         */
        this.ticketCounter = 0;
    }

    /**
     * Wraps a ticket number around the maximum.
     * @private
     * @param {number} ticket
     * @returns {number}
     */
    static _nextTicket(ticket) {
        return ticket === MAX_TICKET_NUMBER ? 1 : ticket + 1;
    }

    /**
     * Finds the next valid pending reader cursor.
     * @private
     * @param {ReadWriteLock} lock
     * @returns {number}
     */
    static _nextPendingReader(lock) {
        if (Object.keys(lock.pendingReaders).length === 0) return 0;
        let cursor = ReadWriteLock._nextTicket(lock.nextReaderCursor);
        while (!lock.pendingReaders[cursor]) {
            cursor = ReadWriteLock._nextTicket(cursor);
        }
        return cursor;
    }

    /**
     * Finds the next valid pending writer cursor.
     * @private
     * @param {ReadWriteLock} lock
     * @returns {number}
     */
    static _nextPendingWriter(lock) {
        if (Object.keys(lock.pendingWriters).length === 0) return 0;
        let cursor = ReadWriteLock._nextTicket(lock.nextWriterCursor);
        while (!lock.pendingWriters[cursor]) {
            cursor = ReadWriteLock._nextTicket(cursor);
        }
        return cursor;
    }

    /**
     * Cancels a pending read or write lock request.
     * @param {number} ticket - The ticket to cancel
     */
    cancel(ticket) {
        if (this.pendingReaders[ticket]) {
            const callback = this.pendingReaders[ticket];
            delete this.pendingReaders[ticket];
            if (ticket === this.nextReaderCursor) {
                this.nextReaderCursor = ReadWriteLock._nextPendingReader(this);
            }
            callback.call(this, true);
        }
        if (this.pendingWriters[ticket]) {
            const callback = this.pendingWriters[ticket];
            delete this.pendingWriters[ticket];
            if (ticket === this.nextWriterCursor) {
                this.nextWriterCursor = ReadWriteLock._nextPendingWriter(this);
            }
            callback.call(this, true);
        }
    }

    /**
     * Cancels all pending read and write lock requests.
     */
    cancelAll() {
        while (this.nextWriterCursor !== 0) {
            this.cancel(this.nextWriterCursor);
        }
        while (this.nextReaderCursor !== 0) {
            this.cancel(this.nextReaderCursor);
        }
    }

    /**
     * Acquires a read lock. If no writer is active and no writers are queued,
     * the lock is granted immediately. Otherwise, the request is queued.
     *
     * @param {number} timeout - Timeout in ms (-1 for no timeout)
     * @param {Object} callback - Callback with result/timeout/error
     * @returns {number} The ticket number
     */
    acquireReadLock(timeout, callback) {
        const self = this;
        const ticket = ReadWriteLock._nextTicket(this.ticketCounter);
        this.ticketCounter = ticket;

        asyncCallback(callback, () => {
            // Grant immediately if no active writer and no pending writers
            if (!self.activeWriter && Object.keys(self.pendingWriters).length === 0) {
                self.activeReaders[ticket] = true;
                return ticket;
            }

            let timeoutId;
            if (timeout !== -1) {
                timeoutId = setTimeout(() => {
                    delete self.pendingReaders[ticket];
                    if (ticket === self.nextReaderCursor) {
                        self.nextReaderCursor = ReadWriteLock._nextPendingReader(self);
                    }
                    callback.timeout();
                }, timeout);
            }

            self.pendingReaders[ticket] = function (cancelled) {
                clearTimeout(timeoutId);
                if (cancelled) {
                    setTimeout(() => callback.result(undefined), 0);
                } else {
                    self.activeReaders[ticket] = true;
                    setTimeout(() => callback.result(ticket), 0);
                }
            };

            if (!self.nextReaderCursor) {
                self.nextReaderCursor = ticket;
            }
        });

        return ticket;
    }

    /**
     * Acquires a write lock. If no readers are active, no readers are pending,
     * and no writer is active, the lock is granted immediately.
     *
     * @param {number} timeout - Timeout in ms (-1 for no timeout)
     * @param {Object} callback - Callback with result/timeout/error
     */
    acquireWriteLock(timeout, callback) {
        const self = this;
        const ticket = ReadWriteLock._nextTicket(this.ticketCounter);
        this.ticketCounter = ticket;

        asyncCallback(callback, () => {
            if (Object.keys(self.activeReaders).length === 0 && Object.keys(self.pendingReaders).length === 0 && !self.activeWriter) {
                self.activeWriter = ticket;
                return;
            }

            let timeoutId;
            if (timeout !== -1) {
                timeoutId = setTimeout(() => {
                    delete self.pendingWriters[ticket];
                    if (ticket === self.nextWriterCursor) {
                        self.nextWriterCursor = ReadWriteLock._nextPendingWriter(self);
                    }
                    callback.timeout();
                }, timeout);
            }

            self.pendingWriters[ticket] = function (cancelled) {
                clearTimeout(timeoutId);
                if (cancelled) {
                    setTimeout(() => callback.result(undefined), 0);
                } else {
                    self.activeWriter = ticket;
                    setTimeout(() => callback.result(ticket), 0);
                }
            };

            if (!self.nextWriterCursor) {
                self.nextWriterCursor = ticket;
            }
        });
    }

    /**
     * Releases a read or write lock by ticket number, potentially granting
     * access to the next queued writer or all queued readers.
     *
     * @param {number} ticket - The ticket to release
     * @throws {Error} If the ticket is invalid
     */
    unlock(ticket) {
        if (ticket === this.activeWriter) {
            this.activeWriter = null;
        } else {
            if (!this.activeReaders[ticket]) {
                throw new MslInternalException("There is no reader or writer with ticket number " + ticket + ".");
            }
            delete this.activeReaders[ticket];
        }

        // Try to grant a waiting writer first
        if (this.nextWriterCursor) {
            if (Object.keys(this.activeReaders).length > 0) return;
            const writerCallback = this.pendingWriters[this.nextWriterCursor];
            delete this.pendingWriters[this.nextWriterCursor];
            this.nextWriterCursor = ReadWriteLock._nextPendingWriter(this);
            writerCallback.call(this, false);
        } else {
            // Grant all queued readers
            for (let cursor = this.nextReaderCursor; Object.keys(this.pendingReaders).length > 0; cursor = ReadWriteLock._nextTicket(cursor)) {
                if (this.pendingReaders[cursor]) {
                    const readerCallback = this.pendingReaders[cursor];
                    delete this.pendingReaders[cursor];
                    readerCallback.call(this, false);
                }
            }
            this.nextReaderCursor = 0;
        }
    }
}
