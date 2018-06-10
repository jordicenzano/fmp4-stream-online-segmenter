//Jordi Cenzano 2018

"use strict";

// Constructor
class extendedError extends Error {

    constructor(message, is_fatal = false) {
        super(message);

        this.is_fatal = is_fatal;
    }

    isFatal() {
        return this.is_fatal;
    }

}

//Export class
module.exports.extendedError = extendedError;
