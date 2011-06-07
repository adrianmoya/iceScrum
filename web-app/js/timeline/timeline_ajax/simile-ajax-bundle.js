/* platform.js */
SimileAjax.version = "pre 2.3.0";
if (typeof window["$"] == "undefined") {
    window.$ = SimileAjax.jQuery;
}
SimileAjax.Platform.os = {isMac:false,isWin:false,isWin32:false,isUnix:false};
SimileAjax.Platform.browser = {isIE:false,isNetscape:false,isMozilla:false,isFirefox:false,isOpera:false,isSafari:false,majorVersion:0,minorVersion:0};
(function() {
    var C = navigator.appName.toLowerCase();
    var A = navigator.userAgent.toLowerCase();
    SimileAjax.Platform.os.isMac = (A.indexOf("mac") != -1);
    SimileAjax.Platform.os.isWin = (A.indexOf("win") != -1);
    SimileAjax.Platform.os.isWin32 = SimileAjax.Platform.isWin && (A.indexOf("95") != -1 || A.indexOf("98") != -1 || A.indexOf("nt") != -1 || A.indexOf("win32") != -1 || A.indexOf("32bit") != -1);
    SimileAjax.Platform.os.isUnix = (A.indexOf("x11") != -1);
    SimileAjax.Platform.browser.isIE = (C.indexOf("microsoft") != -1);
    SimileAjax.Platform.browser.isNetscape = (C.indexOf("netscape") != -1);
    SimileAjax.Platform.browser.isMozilla = (A.indexOf("mozilla") != -1);
    SimileAjax.Platform.browser.isFirefox = (A.indexOf("firefox") != -1);
    SimileAjax.Platform.browser.isOpera = (C.indexOf("opera") != -1);
    SimileAjax.Platform.browser.isSafari = (C.indexOf("safari") != -1);
    var E = function(G) {
        var F = G.split(".");
        SimileAjax.Platform.browser.majorVersion = parseInt(F[0]);
        SimileAjax.Platform.browser.minorVersion = parseInt(F[1]);
    };
    var B = function(H, G, I) {
        var F = H.indexOf(G, I);
        return F >= 0 ? F : H.length;
    };
    if (SimileAjax.Platform.browser.isMozilla) {
        var D = A.indexOf("mozilla/");
        if (D >= 0) {
            E(A.substring(D + 8, B(A, " ", D)));
        }
    }
    if (SimileAjax.Platform.browser.isIE) {
        var D = A.indexOf("msie ");
        if (D >= 0) {
            E(A.substring(D + 5, B(A, ";", D)));
        }
    }
    if (SimileAjax.Platform.browser.isNetscape) {
        var D = A.indexOf("rv:");
        if (D >= 0) {
            E(A.substring(D + 3, B(A, ")", D)));
        }
    }
    if (SimileAjax.Platform.browser.isFirefox) {
        var D = A.indexOf("firefox/");
        if (D >= 0) {
            E(A.substring(D + 8, B(A, " ", D)));
        }
    }
    if (!("localeCompare" in String.prototype)) {
        String.prototype.localeCompare = function(F) {
            if (this < F) {
                return -1;
            } else {
                if (this > F) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
    }
})();
SimileAjax.Platform.getDefaultLocale = function() {
    return SimileAjax.Platform.clientLocale;
};


/* ajax.js */
SimileAjax.ListenerQueue = function(A) {
    this._listeners = [];
    this._wildcardHandlerName = A;
};
SimileAjax.ListenerQueue.prototype.add = function(A) {
    this._listeners.push(A);
};
SimileAjax.ListenerQueue.prototype.remove = function(C) {
    var A = this._listeners;
    for (var B = 0;
         B < A.length;
         B++) {
        if (A[B] == C) {
            A.splice(B, 1);
            break;
        }
    }
};
SimileAjax.ListenerQueue.prototype.fire = function(C, B) {
    var A = [].concat(this._listeners);
    for (var D = 0;
         D < A.length;
         D++) {
        var E = A[D];
        if (C in E) {
            try {
                E[C].apply(E, B);
            } catch(F) {
                SimileAjax.Debug.exception("Error firing event of name " + C, F);
            }
        } else {
            if (this._wildcardHandlerName != null && this._wildcardHandlerName in E) {
                try {
                    E[this._wildcardHandlerName].apply(E, [C]);
                } catch(F) {
                    SimileAjax.Debug.exception("Error firing event of name " + C + " to wildcard handler", F);
                }
            }
        }
    }
};


/* data-structure.js */
SimileAjax.Set = function(A) {
    this._hash = {};
    this._count = 0;
    if (A instanceof Array) {
        for (var B = 0;
             B < A.length;
             B++) {
            this.add(A[B]);
        }
    } else {
        if (A instanceof SimileAjax.Set) {
            this.addSet(A);
        }
    }
};
SimileAjax.Set.prototype.add = function(A) {
    if (!(A in this._hash)) {
        this._hash[A] = true;
        this._count++;
        return true;
    }
    return false;
};
SimileAjax.Set.prototype.addSet = function(B) {
    for (var A in B._hash) {
        this.add(A);
    }
};
SimileAjax.Set.prototype.remove = function(A) {
    if (A in this._hash) {
        delete this._hash[A];
        this._count--;
        return true;
    }
    return false;
};
SimileAjax.Set.prototype.removeSet = function(B) {
    for (var A in B._hash) {
        this.remove(A);
    }
};
SimileAjax.Set.prototype.retainSet = function(B) {
    for (var A in this._hash) {
        if (!B.contains(A)) {
            delete this._hash[A];
            this._count--;
        }
    }
};
SimileAjax.Set.prototype.contains = function(A) {
    return(A in this._hash);
};
SimileAjax.Set.prototype.size = function() {
    return this._count;
};
SimileAjax.Set.prototype.toArray = function() {
    var A = [];
    for (var B in this._hash) {
        A.push(B);
    }
    return A;
};
SimileAjax.Set.prototype.visit = function(A) {
    for (var B in this._hash) {
        if (A(B) == true) {
            break;
        }
    }
};
SimileAjax.SortedArray = function(B, A) {
    this._a = (A instanceof Array) ? A : [];
    this._compare = B;
};
SimileAjax.SortedArray.prototype.add = function(C) {
    var A = this;
    var B = this.find(function(D) {
        return A._compare(D, C);
    });
    if (B < this._a.length) {
        this._a.splice(B, 0, C);
    } else {
        this._a.push(C);
    }
};
SimileAjax.SortedArray.prototype.remove = function(C) {
    var A = this;
    var B = this.find(function(D) {
        return A._compare(D, C);
    });
    while (B < this._a.length && this._compare(this._a[B], C) == 0) {
        if (this._a[B] == C) {
            this._a.splice(B, 1);
            return true;
        } else {
            B++;
        }
    }
    return false;
};
SimileAjax.SortedArray.prototype.removeAll = function() {
    this._a = [];
};
SimileAjax.SortedArray.prototype.elementAt = function(A) {
    return this._a[A];
};
SimileAjax.SortedArray.prototype.length = function() {
    return this._a.length;
};
SimileAjax.SortedArray.prototype.find = function(D) {
    var B = 0;
    var A = this._a.length;
    while (B < A) {
        var C = Math.floor((B + A) / 2);
        var E = D(this._a[C]);
        if (C == B) {
            return E < 0 ? B + 1 : B;
        } else {
            if (E < 0) {
                B = C;
            } else {
                A = C;
            }
        }
    }
    return B;
};
SimileAjax.SortedArray.prototype.getFirst = function() {
    return(this._a.length > 0) ? this._a[0] : null;
};
SimileAjax.SortedArray.prototype.getLast = function() {
    return(this._a.length > 0) ? this._a[this._a.length - 1] : null;
};
SimileAjax.EventIndex = function(B) {
    var A = this;
    this._unit = (B != null) ? B : SimileAjax.NativeDateUnit;
    this._events = new SimileAjax.SortedArray(function(C, D) {
        return A._unit.compare(C.getStart(), D.getStart());
    });
    this._idToEvent = {};
    this._indexed = true;
};
SimileAjax.EventIndex.prototype.getUnit = function() {
    return this._unit;
};
SimileAjax.EventIndex.prototype.getEvent = function(A) {
    return this._idToEvent[A];
};
SimileAjax.EventIndex.prototype.add = function(A) {
    this._events.add(A);
    this._idToEvent[A.getID()] = A;
    this._indexed = false;
};
SimileAjax.EventIndex.prototype.removeAll = function() {
    this._events.removeAll();
    this._idToEvent = {};
    this._indexed = false;
};
SimileAjax.EventIndex.prototype.getCount = function() {
    return this._events.length();
};
SimileAjax.EventIndex.prototype.getIterator = function(A, B) {
    if (!this._indexed) {
        this._index();
    }
    return new SimileAjax.EventIndex._Iterator(this._events, A, B, this._unit);
};
SimileAjax.EventIndex.prototype.getReverseIterator = function(A, B) {
    if (!this._indexed) {
        this._index();
    }
    return new SimileAjax.EventIndex._ReverseIterator(this._events, A, B, this._unit);
};
SimileAjax.EventIndex.prototype.getAllIterator = function() {
    return new SimileAjax.EventIndex._AllIterator(this._events);
};
SimileAjax.EventIndex.prototype.getEarliestDate = function() {
    var A = this._events.getFirst();
    return(A == null) ? null : A.getStart();
};
SimileAjax.EventIndex.prototype.getLatestDate = function() {
    var A = this._events.getLast();
    if (A == null) {
        return null;
    }
    if (!this._indexed) {
        this._index();
    }
    var C = A._earliestOverlapIndex;
    var B = this._events.elementAt(C).getEnd();
    for (var D = C + 1;
         D < this._events.length();
         D++) {
        B = this._unit.later(B, this._events.elementAt(D).getEnd());
    }
    return B;
};
SimileAjax.EventIndex.prototype._index = function() {
    var E = this._events.length();
    for (var F = 0;
         F < E;
         F++) {
        var D = this._events.elementAt(F);
        D._earliestOverlapIndex = F;
    }
    var G = 1;
    for (var F = 0;
         F < E;
         F++) {
        var D = this._events.elementAt(F);
        var C = D.getEnd();
        G = Math.max(G, F + 1);
        while (G < E) {
            var A = this._events.elementAt(G);
            var B = A.getStart();
            if (this._unit.compare(B, C) < 0) {
                A._earliestOverlapIndex = F;
                G++;
            } else {
                break;
            }
        }
    }
    this._indexed = true;
};
SimileAjax.EventIndex._Iterator = function(A, C, D, B) {
    this._events = A;
    this._startDate = C;
    this._endDate = D;
    this._unit = B;
    this._currentIndex = A.find(function(E) {
        return B.compare(E.getStart(), C);
    });
    if (this._currentIndex - 1 >= 0) {
        this._currentIndex = this._events.elementAt(this._currentIndex - 1)._earliestOverlapIndex;
    }
    this._currentIndex--;
    this._maxIndex = A.find(function(E) {
        return B.compare(E.getStart(), D);
    });
    this._hasNext = false;
    this._next = null;
    this._findNext();
};
SimileAjax.EventIndex._Iterator.prototype = {hasNext:function() {
    return this._hasNext;
},next:function() {
    if (this._hasNext) {
        var A = this._next;
        this._findNext();
        return A;
    } else {
        return null;
    }
},_findNext:function() {
    var B = this._unit;
    while ((++this._currentIndex) < this._maxIndex) {
        var A = this._events.elementAt(this._currentIndex);
        if (B.compare(A.getStart(), this._endDate) < 0 && B.compare(A.getEnd(), this._startDate) > 0) {
            this._next = A;
            this._hasNext = true;
            return;
        }
    }
    this._next = null;
    this._hasNext = false;
}};
SimileAjax.EventIndex._ReverseIterator = function(A, C, D, B) {
    this._events = A;
    this._startDate = C;
    this._endDate = D;
    this._unit = B;
    this._minIndex = A.find(function(E) {
        return B.compare(E.getStart(), C);
    });
    if (this._minIndex - 1 >= 0) {
        this._minIndex = this._events.elementAt(this._minIndex - 1)._earliestOverlapIndex;
    }
    this._maxIndex = A.find(function(E) {
        return B.compare(E.getStart(), D);
    });
    this._currentIndex = this._maxIndex;
    this._hasNext = false;
    this._next = null;
    this._findNext();
};
SimileAjax.EventIndex._ReverseIterator.prototype = {hasNext:function() {
    return this._hasNext;
},next:function() {
    if (this._hasNext) {
        var A = this._next;
        this._findNext();
        return A;
    } else {
        return null;
    }
},_findNext:function() {
    var B = this._unit;
    while ((--this._currentIndex) >= this._minIndex) {
        var A = this._events.elementAt(this._currentIndex);
        if (B.compare(A.getStart(), this._endDate) < 0 && B.compare(A.getEnd(), this._startDate) > 0) {
            this._next = A;
            this._hasNext = true;
            return;
        }
    }
    this._next = null;
    this._hasNext = false;
}};
SimileAjax.EventIndex._AllIterator = function(A) {
    this._events = A;
    this._index = 0;
};
SimileAjax.EventIndex._AllIterator.prototype = {hasNext:function() {
    return this._index < this._events.length();
},next:function() {
    return this._index < this._events.length() ? this._events.elementAt(this._index++) : null;
}};


/* date-time.js */
SimileAjax.DateTime = new Object();
SimileAjax.DateTime.MILLISECOND = 0;
SimileAjax.DateTime.SECOND = 1;
SimileAjax.DateTime.MINUTE = 2;
SimileAjax.DateTime.HOUR = 3;
SimileAjax.DateTime.DAY = 4;
SimileAjax.DateTime.WEEK = 5;
SimileAjax.DateTime.MONTH = 6;
SimileAjax.DateTime.YEAR = 7;
SimileAjax.DateTime.DECADE = 8;
SimileAjax.DateTime.CENTURY = 9;
SimileAjax.DateTime.MILLENNIUM = 10;
SimileAjax.DateTime.EPOCH = -1;
SimileAjax.DateTime.ERA = -2;
SimileAjax.DateTime.gregorianUnitLengths = [];
(function() {
    var B = SimileAjax.DateTime;
    var A = B.gregorianUnitLengths;
    A[B.MILLISECOND] = 1;
    A[B.SECOND] = 1000;
    A[B.MINUTE] = A[B.SECOND] * 60;
    A[B.HOUR] = A[B.MINUTE] * 60;
    A[B.DAY] = A[B.HOUR] * 24;
    A[B.WEEK] = A[B.DAY] * 7;
    A[B.MONTH] = A[B.DAY] * 31;
    A[B.YEAR] = A[B.DAY] * 365;
    A[B.DECADE] = A[B.YEAR] * 10;
    A[B.CENTURY] = A[B.YEAR] * 100;
    A[B.MILLENNIUM] = A[B.YEAR] * 1000;
})();
SimileAjax.DateTime._dateRegexp = new RegExp("^(-?)([0-9]{4})(" + ["(-?([0-9]{2})(-?([0-9]{2}))?)","(-?([0-9]{3}))","(-?W([0-9]{2})(-?([1-7]))?)"].join("|") + ")?$");
SimileAjax.DateTime._timezoneRegexp = new RegExp("Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$");
SimileAjax.DateTime._timeRegexp = new RegExp("^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$");
SimileAjax.DateTime.setIso8601Date = function(G, C) {
    var I = C.match(SimileAjax.DateTime._dateRegexp);
    if (!I) {
        throw new Error("Invalid date string: " + C);
    }
    var B = (I[1] == "-") ? -1 : 1;
    var J = B * I[2];
    var H = I[5];
    var D = I[7];
    var F = I[9];
    var A = I[11];
    var M = (I[13]) ? I[13] : 1;
    G.setUTCFullYear(J);
    if (F) {
        G.setUTCMonth(0);
        G.setUTCDate(Number(F));
    } else {
        if (A) {
            G.setUTCMonth(0);
            G.setUTCDate(1);
            var L = G.getUTCDay();
            var K = (L) ? L : 7;
            var E = Number(M) + (7 * Number(A));
            if (K <= 4) {
                G.setUTCDate(E + 1 - K);
            } else {
                G.setUTCDate(E + 8 - K);
            }
        } else {
            if (H) {
                G.setUTCDate(1);
                G.setUTCMonth(H - 1);
            }
            if (D) {
                G.setUTCDate(D);
            }
        }
    }
    return G;
};
SimileAjax.DateTime.setIso8601Time = function(F, D) {
    var G = D.match(SimileAjax.DateTime._timeRegexp);
    if (!G) {
        SimileAjax.Debug.warn("Invalid time string: " + D);
        return false;
    }
    var A = G[1];
    var E = Number((G[3]) ? G[3] : 0);
    var C = (G[5]) ? G[5] : 0;
    var B = G[7] ? (Number("0." + G[7]) * 1000) : 0;
    F.setUTCHours(A);
    F.setUTCMinutes(E);
    F.setUTCSeconds(C);
    F.setUTCMilliseconds(B);
    return F;
};
SimileAjax.DateTime.timezoneOffset = new Date().getTimezoneOffset();
SimileAjax.DateTime.setIso8601 = function(B, A) {
    var D = null;
    var E = (A.indexOf("T") == -1) ? A.split(" ") : A.split("T");
    SimileAjax.DateTime.setIso8601Date(B, E[0]);
    if (E.length == 2) {
        var C = E[1].match(SimileAjax.DateTime._timezoneRegexp);
        if (C) {
            if (C[0] == "Z") {
                D = 0;
            } else {
                D = (Number(C[3]) * 60) + Number(C[5]);
                D *= ((C[2] == "-") ? 1 : -1);
            }
            E[1] = E[1].substr(0, E[1].length - C[0].length);
        }
        SimileAjax.DateTime.setIso8601Time(B, E[1]);
    }
    if (D == null) {
        D = B.getTimezoneOffset();
    }
    B.setTime(B.getTime() + D * 60000);
    return B;
};
SimileAjax.DateTime.parseIso8601DateTime = function(A) {
    try {
        return SimileAjax.DateTime.setIso8601(new Date(0), A);
    } catch(B) {
        return null;
    }
};
SimileAjax.DateTime.parseGregorianDateTime = function(F) {
    if (F == null) {
        return null;
    } else {
        if (F instanceof Date) {
            return F;
        }
    }
    var B = F.toString();
    if (B.length > 0 && B.length < 8) {
        var C = B.indexOf(" ");
        if (C > 0) {
            var A = parseInt(B.substr(0, C));
            var G = B.substr(C + 1);
            if (G.toLowerCase() == "bc") {
                A = 1 - A;
            }
        } else {
            var A = parseInt(B);
        }
        var E = new Date(0);
        E.setUTCFullYear(A);
        return E;
    }
    try {
        return new Date(Date.parse(B));
    } catch(D) {
        return null;
    }
};
SimileAjax.DateTime.roundDownToInterval = function(E, B, I, K, A) {
    var F = I * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
    var J = new Date(E.getTime() + F);
    var C = function(L) {
        L.setUTCMilliseconds(0);
        L.setUTCSeconds(0);
        L.setUTCMinutes(0);
        L.setUTCHours(0);
    };
    var D = function(L) {
        C(L);
        L.setUTCDate(1);
        L.setUTCMonth(0);
    };
    switch (B) {
        case SimileAjax.DateTime.MILLISECOND:
            var H = J.getUTCMilliseconds();
            J.setUTCMilliseconds(H - (H % K));
            break;
        case SimileAjax.DateTime.SECOND:
            J.setUTCMilliseconds(0);
            var H = J.getUTCSeconds();
            J.setUTCSeconds(H - (H % K));
            break;
        case SimileAjax.DateTime.MINUTE:
            J.setUTCMilliseconds(0);
            J.setUTCSeconds(0);
            var H = J.getUTCMinutes();
            J.setTime(J.getTime() - (H % K) * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
            break;
        case SimileAjax.DateTime.HOUR:
            J.setUTCMilliseconds(0);
            J.setUTCSeconds(0);
            J.setUTCMinutes(0);
            var H = J.getUTCHours();
            J.setUTCHours(H - (H % K));
            break;
        case SimileAjax.DateTime.DAY:
            C(J);
            break;
        case SimileAjax.DateTime.WEEK:
            C(J);
            var G = (J.getUTCDay() + 7 - A) % 7;
            J.setTime(J.getTime() - G * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY]);
            break;
        case SimileAjax.DateTime.MONTH:
            C(J);
            J.setUTCDate(1);
            var H = J.getUTCMonth();
            J.setUTCMonth(H - (H % K));
            break;
        case SimileAjax.DateTime.YEAR:
            D(J);
            var H = J.getUTCFullYear();
            J.setUTCFullYear(H - (H % K));
            break;
        case SimileAjax.DateTime.DECADE:
            D(J);
            J.setUTCFullYear(Math.floor(J.getUTCFullYear() / 10) * 10);
            break;
        case SimileAjax.DateTime.CENTURY:
            D(J);
            J.setUTCFullYear(Math.floor(J.getUTCFullYear() / 100) * 100);
            break;
        case SimileAjax.DateTime.MILLENNIUM:
            D(J);
            J.setUTCFullYear(Math.floor(J.getUTCFullYear() / 1000) * 1000);
            break;
    }
    E.setTime(J.getTime() - F);
};
SimileAjax.DateTime.roundUpToInterval = function(C, F, D, A, B) {
    var E = C.getTime();
    SimileAjax.DateTime.roundDownToInterval(C, F, D, A, B);
    if (C.getTime() < E) {
        C.setTime(C.getTime() + SimileAjax.DateTime.gregorianUnitLengths[F] * A);
    }
};
SimileAjax.DateTime.incrementByInterval = function(A, D, B) {
    B = (typeof B == "undefined") ? 0 : B;
    var E = B * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
    var C = new Date(A.getTime() + E);
    switch (D) {
        case SimileAjax.DateTime.MILLISECOND:
            C.setTime(C.getTime() + 1);
            break;
        case SimileAjax.DateTime.SECOND:
            C.setTime(C.getTime() + 1000);
            break;
        case SimileAjax.DateTime.MINUTE:
            C.setTime(C.getTime() + SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
            break;
        case SimileAjax.DateTime.HOUR:
            C.setTime(C.getTime() + SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
            break;
        case SimileAjax.DateTime.DAY:
            C.setUTCDate(C.getUTCDate() + 1);
            break;
        case SimileAjax.DateTime.WEEK:
            C.setUTCDate(C.getUTCDate() + 7);
            break;
        case SimileAjax.DateTime.MONTH:
            C.setUTCMonth(C.getUTCMonth() + 1);
            break;
        case SimileAjax.DateTime.YEAR:
            C.setUTCFullYear(C.getUTCFullYear() + 1);
            break;
        case SimileAjax.DateTime.DECADE:
            C.setUTCFullYear(C.getUTCFullYear() + 10);
            break;
        case SimileAjax.DateTime.CENTURY:
            C.setUTCFullYear(C.getUTCFullYear() + 100);
            break;
        case SimileAjax.DateTime.MILLENNIUM:
            C.setUTCFullYear(C.getUTCFullYear() + 1000);
            break;
    }
    A.setTime(C.getTime() - E);
};
SimileAjax.DateTime.removeTimeZoneOffset = function(A, B) {
    return new Date(A.getTime() + B * SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
};
SimileAjax.DateTime.getTimezone = function() {
    var A = new Date().getTimezoneOffset();
    return A / -60;
};


/* debug.js */
SimileAjax.Debug = {silent:false};
SimileAjax.Debug.log = function(B) {
    var A;
    if ("console" in window && "log" in window.console) {
        A = function(C) {
            console.log(C);
        };
    } else {
        A = function(C) {
            if (!SimileAjax.Debug.silent) {
                alert(C);
            }
        };
    }
    SimileAjax.Debug.log = A;
    A(B);
};
SimileAjax.Debug.warn = function(B) {
    var A;
    if ("console" in window && "warn" in window.console) {
        A = function(C) {
            console.warn(C);
        };
    } else {
        A = function(C) {
            if (!SimileAjax.Debug.silent) {
                alert(C);
            }
        };
    }
    SimileAjax.Debug.warn = A;
    A(B);
};
SimileAjax.Debug.exception = function(B, D) {
    var A,C = SimileAjax.parseURLParameters();
    if (C.errors == "throw" || SimileAjax.params.errors == "throw") {
        A = function(F, E) {
            throw (F);
        };
    } else {
        if ("console" in window && "error" in window.console) {
            A = function(F, E) {
                if (E != null) {
                    console.error(E + " %o", F);
                } else {
                    console.error(F);
                }
                throw (F);
            };
        } else {
            A = function(F, E) {
                if (!SimileAjax.Debug.silent) {
                    alert("Caught exception: " + E + "\n\nDetails: " + ("description" in F ? F.description : F));
                }
                throw (F);
            };
        }
    }
    SimileAjax.Debug.exception = A;
    A(B, D);
};
SimileAjax.Debug.objectToString = function(A) {
    return SimileAjax.Debug._objectToString(A, "");
};
SimileAjax.Debug._objectToString = function(D, C) {
    var B = C + " ";
    if (typeof D == "object") {
        var A = "{";
        for (E in D) {
            A += B + E + ": " + SimileAjax.Debug._objectToString(D[E], B) + "\n";
        }
        A += C + "}";
        return A;
    } else {
        if (typeof D == "array") {
            var A = "[";
            for (var E = 0;
                 E < D.length;
                 E++) {
                A += SimileAjax.Debug._objectToString(D[E], B) + "\n";
            }
            A += C + "]";
            return A;
        } else {
            return D;
        }
    }
};


/* dom.js */
SimileAjax.DOM = new Object();
SimileAjax.DOM.registerEventWithObject = function(C, A, D, B) {
    SimileAjax.DOM.registerEvent(C, A, function(F, E, G) {
        return D[B].call(D, F, E, G);
    });
};
SimileAjax.DOM.registerEvent = function(C, B, D) {
    var A = function(E) {
        E = (E) ? E : ((event) ? event : null);
        if (E) {
            var F = (E.target) ? E.target : ((E.srcElement) ? E.srcElement : null);
            if (F) {
                F = (F.nodeType == 1 || F.nodeType == 9) ? F : F.parentNode;
            }
            return D(C, E, F);
        }
        return true;
    };
    if (SimileAjax.Platform.browser.isIE) {
        C.attachEvent("on" + B, A);
    } else {
        C.addEventListener(B, A, false);
    }
};
SimileAjax.DOM.getPageCoordinates = function(B) {
    var E = 0;
    var D = 0;
    if (B.nodeType != 1) {
        B = B.parentNode;
    }
    var C = B;
    while (C != null) {
        E += C.offsetLeft;
        D += C.offsetTop;
        C = C.offsetParent;
    }
    var A = document.body;
    while (B != null && B != A) {
        if ("scrollLeft" in B) {
            E -= B.scrollLeft;
            D -= B.scrollTop;
        }
        B = B.parentNode;
    }
    return{left:E,top:D};
};
SimileAjax.DOM.getSize = function(B) {
    var A = this.getStyle(B, "width");
    var C = this.getStyle(B, "height");
    if (A.indexOf("px") > -1) {
        A = A.replace("px", "");
    }
    if (C.indexOf("px") > -1) {
        C = C.replace("px", "");
    }
    return{w:A,h:C};
};
SimileAjax.DOM.getStyle = function(B, A) {
    if (B.currentStyle) {
        var C = B.currentStyle[A];
    } else {
        if (window.getComputedStyle) {
            var C = document.defaultView.getComputedStyle(B, null).getPropertyValue(A);
        } else {
            var C = "";
        }
    }
    return C;
};
SimileAjax.DOM.getEventRelativeCoordinates = function(B, C) {
    if (SimileAjax.Platform.browser.isIE) {
        if (B.type == "mousewheel") {
            var A = SimileAjax.DOM.getPageCoordinates(C);
            return{x:B.clientX - A.left,y:B.clientY - A.top};
        } else {
            return{x:B.offsetX,y:B.offsetY};
        }
    } else {
        var A = SimileAjax.DOM.getPageCoordinates(C);
        if ((B.type == "DOMMouseScroll") && SimileAjax.Platform.browser.isFirefox && (SimileAjax.Platform.browser.majorVersion == 2)) {
            return{x:B.screenX - A.left,y:B.screenY - A.top};
        } else {
            return{x:B.pageX - A.left,y:B.pageY - A.top};
        }
    }
};
SimileAjax.DOM.getEventPageCoordinates = function(A) {
    if (SimileAjax.Platform.browser.isIE) {
        return{x:A.clientX + document.body.scrollLeft,y:A.clientY + document.body.scrollTop};
    } else {
        return{x:A.pageX,y:A.pageY};
    }
};
SimileAjax.DOM.hittest = function(A, C, B) {
    return SimileAjax.DOM._hittest(document.body, A, C, B);
};
SimileAjax.DOM._hittest = function(C, L, K, A) {
    var M = C.childNodes;
    outer:for (var G = 0;
               G < M.length;
               G++) {
        var H = M[G];
        for (var F = 0;
             F < A.length;
             F++) {
            if (H == A[F]) {
                continue outer;
            }
        }
        if (H.offsetWidth == 0 && H.offsetHeight == 0) {
            var B = SimileAjax.DOM._hittest(H, L, K, A);
            if (B != H) {
                return B;
            }
        } else {
            var J = 0;
            var E = 0;
            var D = H;
            while (D) {
                J += D.offsetTop;
                E += D.offsetLeft;
                D = D.offsetParent;
            }
            if (E <= L && J <= K && (L - E) < H.offsetWidth && (K - J) < H.offsetHeight) {
                return SimileAjax.DOM._hittest(H, L, K, A);
            } else {
                if (H.nodeType == 1 && H.tagName == "TR") {
                    var I = SimileAjax.DOM._hittest(H, L, K, A);
                    if (I != H) {
                        return I;
                    }
                }
            }
        }
    }
    return C;
};
SimileAjax.DOM.cancelEvent = function(A) {
    A.returnValue = false;
    A.cancelBubble = true;
    if ("preventDefault" in A) {
        A.preventDefault();
    }
};
SimileAjax.DOM.appendClassName = function(D, A) {
    var C = D.className.split(" ");
    for (var B = 0;
         B < C.length;
         B++) {
        if (C[B] == A) {
            return;
        }
    }
    C.push(A);
    D.className = C.join(" ");
};
SimileAjax.DOM.createInputElement = function(A) {
    var B = document.createElement("div");
    B.innerHTML = "<input type='" + A + "' />";
    return B.firstChild;
};
SimileAjax.DOM.createDOMFromTemplate = function(A) {
    var B = {};
    B.elmt = SimileAjax.DOM._createDOMFromTemplate(A, B, null);
    return B;
};
SimileAjax.DOM._createDOMFromTemplate = function(F, G, D) {
    if (F == null) {
        return null;
    } else {
        if (typeof F != "object") {
            var C = document.createTextNode(F);
            if (D != null) {
                D.appendChild(C);
            }
            return C;
        } else {
            var A = null;
            if ("tag" in F) {
                var J = F.tag;
                if (D != null) {
                    if (J == "tr") {
                        A = D.insertRow(D.rows.length);
                    } else {
                        if (J == "td") {
                            A = D.insertCell(D.cells.length);
                        }
                    }
                }
                if (A == null) {
                    A = J == "input" ? SimileAjax.DOM.createInputElement(F.type) : document.createElement(J);
                    if (D != null) {
                        D.appendChild(A);
                    }
                }
            } else {
                A = F.elmt;
                if (D != null) {
                    D.appendChild(A);
                }
            }
            for (var B in F) {
                var H = F[B];
                if (B == "field") {
                    G[H] = A;
                } else {
                    if (B == "className") {
                        A.className = H;
                    } else {
                        if (B == "id") {
                            A.id = H;
                        } else {
                            if (B == "title") {
                                A.title = H;
                            } else {
                                if (B == "type" && A.tagName == "input") {
                                } else {
                                    if (B == "style") {
                                        for (n in H) {
                                            var I = H[n];
                                            if (n == "float") {
                                                n = SimileAjax.Platform.browser.isIE ? "styleFloat" : "cssFloat";
                                            }
                                            A.style[n] = I;
                                        }
                                    } else {
                                        if (B == "children") {
                                            for (var E = 0;
                                                 E < H.length;
                                                 E++) {
                                                SimileAjax.DOM._createDOMFromTemplate(H[E], G, A);
                                            }
                                        } else {
                                            if (B != "tag" && B != "elmt") {
                                                A.setAttribute(B, H);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return A;
        }
    }
};
SimileAjax.DOM._cachedParent = null;
SimileAjax.DOM.createElementFromString = function(A) {
    if (SimileAjax.DOM._cachedParent == null) {
        SimileAjax.DOM._cachedParent = document.createElement("div");
    }
    SimileAjax.DOM._cachedParent.innerHTML = A;
    return SimileAjax.DOM._cachedParent.firstChild;
};
SimileAjax.DOM.createDOMFromString = function(A, C, D) {
    var B = typeof A == "string" ? document.createElement(A) : A;
    B.innerHTML = C;
    var E = {elmt:B};
    SimileAjax.DOM._processDOMChildrenConstructedFromString(E, B, D != null ? D : {});
    return E;
};
SimileAjax.DOM._processDOMConstructedFromString = function(D, A, B) {
    var E = A.id;
    if (E != null && E.length > 0) {
        A.removeAttribute("id");
        if (E in B) {
            var C = A.parentNode;
            C.insertBefore(B[E], A);
            C.removeChild(A);
            D[E] = B[E];
            return;
        } else {
            D[E] = A;
        }
    }
    if (A.hasChildNodes()) {
        SimileAjax.DOM._processDOMChildrenConstructedFromString(D, A, B);
    }
};
SimileAjax.DOM._processDOMChildrenConstructedFromString = function(E, B, D) {
    var C = B.firstChild;
    while (C != null) {
        var A = C.nextSibling;
        if (C.nodeType == 1) {
            SimileAjax.DOM._processDOMConstructedFromString(E, C, D);
        }
        C = A;
    }
};


/* graphics.js */
SimileAjax.Graphics = new Object();
SimileAjax.Graphics.pngIsTranslucent = (!SimileAjax.Platform.browser.isIE) || (SimileAjax.Platform.browser.majorVersion > 6);
if (!SimileAjax.Graphics.pngIsTranslucent) {
    SimileAjax.includeCssFile(document, SimileAjax.urlPrefix + "styles/graphics-ie6.css");
}
SimileAjax.Graphics._createTranslucentImage1 = function(A, C) {
    var B = document.createElement("img");
    B.setAttribute("src", A);
    if (C != null) {
        B.style.verticalAlign = C;
    }
    return B;
};
SimileAjax.Graphics._createTranslucentImage2 = function(A, C) {
    var B = document.createElement("img");
    B.style.width = "1px";
    B.style.height = "1px";
    B.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + A + "', sizingMethod='image')";
    B.style.verticalAlign = (C != null) ? C : "middle";
    return B;
};
SimileAjax.Graphics.createTranslucentImage = SimileAjax.Graphics.pngIsTranslucent ? SimileAjax.Graphics._createTranslucentImage1 : SimileAjax.Graphics._createTranslucentImage2;
SimileAjax.Graphics._createTranslucentImageHTML1 = function(A, B) {
    return'<img src="' + A + '"' + (B != null ? ' style="vertical-align: ' + B + ';"' : "") + " />";
};
SimileAjax.Graphics._createTranslucentImageHTML2 = function(A, C) {
    var B = "width: 1px; height: 1px; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + A + "', sizingMethod='image');" + (C != null ? " vertical-align: " + C + ";" : "");
    return"<img src='" + A + "' style=\"" + B + '" />';
};
SimileAjax.Graphics.createTranslucentImageHTML = SimileAjax.Graphics.pngIsTranslucent ? SimileAjax.Graphics._createTranslucentImageHTML1 : SimileAjax.Graphics._createTranslucentImageHTML2;
SimileAjax.Graphics.setOpacity = function(B, A) {
    if (SimileAjax.Platform.browser.isIE) {
        B.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Style=0,Opacity=" + A + ")";
    } else {
        var C = (A / 100).toString();
        B.style.opacity = C;
        B.style.MozOpacity = C;
    }
};
SimileAjax.Graphics.bubbleConfig = {containerCSSClass:"simileAjax-bubble-container",innerContainerCSSClass:"simileAjax-bubble-innerContainer",contentContainerCSSClass:"simileAjax-bubble-contentContainer",borderGraphicSize:50,borderGraphicCSSClassPrefix:"simileAjax-bubble-border-",arrowGraphicTargetOffset:33,arrowGraphicLength:100,arrowGraphicWidth:49,arrowGraphicCSSClassPrefix:"simileAjax-bubble-arrow-",closeGraphicCSSClass:"simileAjax-bubble-close",extraPadding:20};
SimileAjax.Graphics.createBubbleForContentAndPoint = function(F, E, C, B, D, A) {
    if (typeof B != "number") {
        B = 300;
    }
    if (typeof A != "number") {
        A = 0;
    }
    F.style.position = "absolute";
    F.style.left = "-5000px";
    F.style.top = "0px";
    F.style.width = B + "px";
    document.body.appendChild(F);
    window.setTimeout(function() {
        var H = F.scrollWidth + 10;
        var J = F.scrollHeight + 10;
        var G = 0;
        if (A > 0 && J > A) {
            J = A;
            G = H - 25;
        }
        var I = SimileAjax.Graphics.createBubbleForPoint(E, C, H, J, D);
        document.body.removeChild(F);
        F.style.position = "static";
        F.style.left = "";
        F.style.top = "";
        if (G > 0) {
            var K = document.createElement("div");
            F.style.width = "";
            K.style.width = G + "px";
            K.appendChild(F);
            I.content.appendChild(K);
        } else {
            F.style.width = H + "px";
            I.content.appendChild(F);
        }
    }, 200);
};
SimileAjax.Graphics.createBubbleForPoint = function(B, A, J, N, F) {
    J = parseInt(J, 10);
    N = parseInt(N, 10);
    var E = SimileAjax.Graphics.bubbleConfig;
    var M = SimileAjax.Graphics.pngIsTranslucent ? "pngTranslucent" : "pngNotTranslucent";
    var L = J + 2 * E.borderGraphicSize;
    var O = N + 2 * E.borderGraphicSize;
    var K = function(S) {
        return S + " " + S + "-" + M;
    };
    var H = document.createElement("div");
    H.className = K(E.containerCSSClass);
    H.style.width = J + "px";
    H.style.height = N + "px";
    var D = document.createElement("div");
    D.className = K(E.innerContainerCSSClass);
    H.appendChild(D);
    var I = function() {
        if (!Q._closed) {
            document.body.removeChild(Q._div);
            Q._doc = null;
            Q._div = null;
            Q._content = null;
            Q._closed = true;
        }
    };
    var Q = {_closed:false};
    var R = SimileAjax.WindowManager.pushLayer(I, true, H);
    Q._div = H;
    Q.close = function() {
        SimileAjax.WindowManager.popLayer(R);
    };
    var G = function(T) {
        var S = document.createElement("div");
        S.className = K(E.borderGraphicCSSClassPrefix + T);
        D.appendChild(S);
    };
    G("top-left");
    G("top-right");
    G("bottom-left");
    G("bottom-right");
    G("left");
    G("right");
    G("top");
    G("bottom");
    var C = document.createElement("div");
    C.className = K(E.contentContainerCSSClass);
    D.appendChild(C);
    Q.content = C;
    var P = document.createElement("div");
    P.className = K(E.closeGraphicCSSClass);
    D.appendChild(P);
    SimileAjax.WindowManager.registerEventWithObject(P, "click", Q, "close");
    (function() {
        var Y = SimileAjax.Graphics.getWindowDimensions();
        var T = Y.w;
        var U = Y.h;
        var V = Math.ceil(E.arrowGraphicWidth / 2);
        var Z = function(b) {
            var a = document.createElement("div");
            a.className = K(E.arrowGraphicCSSClassPrefix + "point-" + b);
            D.appendChild(a);
            return a;
        };
        if (B - V - E.borderGraphicSize - E.extraPadding > 0 && B + V + E.borderGraphicSize + E.extraPadding < T) {
            var X = B - Math.round(J / 2);
            X = B < (T / 2) ? Math.max(X, E.extraPadding + E.borderGraphicSize) : Math.min(X, T - E.extraPadding - E.borderGraphicSize - J);
            if ((F && F == "top") || (!F && (A - E.arrowGraphicTargetOffset - N - E.borderGraphicSize - E.extraPadding > 0))) {
                var S = Z("down");
                S.style.left = (B - V - X) + "px";
                H.style.left = X + "px";
                H.style.top = (A - E.arrowGraphicTargetOffset - N) + "px";
                return;
            } else {
                if ((F && F == "bottom") || (!F && (A + E.arrowGraphicTargetOffset + N + E.borderGraphicSize + E.extraPadding < U))) {
                    var S = Z("up");
                    S.style.left = (B - V - X) + "px";
                    H.style.left = X + "px";
                    H.style.top = (A + E.arrowGraphicTargetOffset) + "px";
                    return;
                }
            }
        }
        var W = A - Math.round(N / 2);
        W = A < (U / 2) ? Math.max(W, E.extraPadding + E.borderGraphicSize) : Math.min(W, U - E.extraPadding - E.borderGraphicSize - N);
        if ((F && F == "left") || (!F && (B - E.arrowGraphicTargetOffset - J - E.borderGraphicSize - E.extraPadding > 0))) {
            var S = Z("right");
            S.style.top = (A - V - W) + "px";
            H.style.top = W + "px";
            H.style.left = (B - E.arrowGraphicTargetOffset - J) + "px";
        } else {
            var S = Z("left");
            S.style.top = (A - V - W) + "px";
            H.style.top = W + "px";
            H.style.left = (B + E.arrowGraphicTargetOffset) + "px";
        }
    })();
    document.body.appendChild(H);
    return Q;
};
SimileAjax.Graphics.getWindowDimensions = function() {
    if (typeof window.innerHeight == "number") {
        return{w:window.innerWidth,h:window.innerHeight};
    } else {
        if (document.documentElement && document.documentElement.clientHeight) {
            return{w:document.documentElement.clientWidth,h:document.documentElement.clientHeight};
        } else {
            if (document.body && document.body.clientHeight) {
                return{w:document.body.clientWidth,h:document.body.clientHeight};
            }
        }
    }
};
SimileAjax.Graphics.createMessageBubble = function(H) {
    var G = H.createElement("div");
    if (SimileAjax.Graphics.pngIsTranslucent) {
        var I = H.createElement("div");
        I.style.height = "33px";
        I.style.background = "url(" + SimileAjax.urlPrefix + "images/message-top-left.png) top left no-repeat";
        I.style.paddingLeft = "44px";
        G.appendChild(I);
        var D = H.createElement("div");
        D.style.height = "33px";
        D.style.background = "url(" + SimileAjax.urlPrefix + "images/message-top-right.png) top right no-repeat";
        I.appendChild(D);
        var F = H.createElement("div");
        F.style.background = "url(" + SimileAjax.urlPrefix + "images/message-left.png) top left repeat-y";
        F.style.paddingLeft = "44px";
        G.appendChild(F);
        var B = H.createElement("div");
        B.style.background = "url(" + SimileAjax.urlPrefix + "images/message-right.png) top right repeat-y";
        B.style.paddingRight = "44px";
        F.appendChild(B);
        var C = H.createElement("div");
        B.appendChild(C);
        var E = H.createElement("div");
        E.style.height = "55px";
        E.style.background = "url(" + SimileAjax.urlPrefix + "images/message-bottom-left.png) bottom left no-repeat";
        E.style.paddingLeft = "44px";
        G.appendChild(E);
        var A = H.createElement("div");
        A.style.height = "55px";
        A.style.background = "url(" + SimileAjax.urlPrefix + "images/message-bottom-right.png) bottom right no-repeat";
        E.appendChild(A);
    } else {
        G.style.border = "2px solid #7777AA";
        G.style.padding = "20px";
        G.style.background = "white";
        SimileAjax.Graphics.setOpacity(G, 90);
        var C = H.createElement("div");
        G.appendChild(C);
    }
    return{containerDiv:G,contentDiv:C};
};
SimileAjax.Graphics.createAnimation = function(B, E, D, C, A) {
    return new SimileAjax.Graphics._Animation(B, E, D, C, A);
};
SimileAjax.Graphics._Animation = function(B, E, D, C, A) {
    this.f = B;
    this.cont = (typeof A == "function") ? A : function() {
    };
    this.from = E;
    this.to = D;
    this.current = E;
    this.duration = C;
    this.start = new Date().getTime();
    this.timePassed = 0;
};
SimileAjax.Graphics._Animation.prototype.run = function() {
    var A = this;
    window.setTimeout(function() {
        A.step();
    }, 50);
};
SimileAjax.Graphics._Animation.prototype.step = function() {
    this.timePassed += 50;
    var A = this.timePassed / this.duration;
    var B = -Math.cos(A * Math.PI) / 2 + 0.5;
    var D = B * (this.to - this.from) + this.from;
    try {
        this.f(D, D - this.current);
    } catch(C) {
    }
    this.current = D;
    if (this.timePassed < this.duration) {
        this.run();
    } else {
        this.f(this.to, 0);
        this["cont"]();
    }
};
SimileAjax.Graphics.createStructuredDataCopyButton = function(F, B, D, E) {
    var G = document.createElement("div");
    G.style.position = "relative";
    G.style.display = "inline";
    G.style.width = B + "px";
    G.style.height = D + "px";
    G.style.overflow = "hidden";
    G.style.margin = "2px";
    if (SimileAjax.Graphics.pngIsTranslucent) {
        G.style.background = "url(" + F + ") no-repeat";
    } else {
        G.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + F + "', sizingMethod='image')";
    }
    var A;
    if (SimileAjax.Platform.browser.isIE) {
        A = "filter:alpha(opacity=0)";
    } else {
        A = "opacity: 0";
    }
    G.innerHTML = "<textarea rows='1' autocomplete='off' value='none' style='" + A + "' />";
    var C = G.firstChild;
    C.style.width = B + "px";
    C.style.height = D + "px";
    C.onmousedown = function(H) {
        H = (H) ? H : ((event) ? event : null);
        if (H.button == 2) {
            C.value = E();
            C.select();
        }
    };
    return G;
};
SimileAjax.Graphics.getWidthHeight = function(C) {
    var A,B;
    if (C.getBoundingClientRect == null) {
        A = C.offsetWidth;
        B = C.offsetHeight;
    } else {
        var D = C.getBoundingClientRect();
        A = Math.ceil(D.right - D.left);
        B = Math.ceil(D.bottom - D.top);
    }
    return{width:A,height:B};
};
SimileAjax.Graphics.getFontRenderingContext = function(A, B) {
    return new SimileAjax.Graphics._FontRenderingContext(A, B);
};
SimileAjax.Graphics._FontRenderingContext = function(A, B) {
    this._elmt = A;
    this._elmt.style.visibility = "hidden";
    if (typeof B == "string") {
        this._elmt.style.width = B;
    } else {
        if (typeof B == "number") {
            this._elmt.style.width = B + "px";
        }
    }
};
SimileAjax.Graphics._FontRenderingContext.prototype.dispose = function() {
    this._elmt = null;
};
SimileAjax.Graphics._FontRenderingContext.prototype.update = function() {
    this._elmt.innerHTML = "A";
    this._lineHeight = this._elmt.offsetHeight;
};
SimileAjax.Graphics._FontRenderingContext.prototype.computeSize = function(D, B) {
    var C = this._elmt;
    C.innerHTML = D;
    C.className = B === undefined ? "" : B;
    var A = SimileAjax.Graphics.getWidthHeight(C);
    C.className = "";
    return A;
};
SimileAjax.Graphics._FontRenderingContext.prototype.getLineHeight = function() {
    return this._lineHeight;
};


/* history.js */
SimileAjax.History = {maxHistoryLength:10,historyFile:"__history__.html",enabled:false,_initialized:false,_listeners:new SimileAjax.ListenerQueue(),_actions:[],_baseIndex:0,_currentIndex:0,_plainDocumentTitle:document.title};
SimileAjax.History.formatHistoryEntryTitle = function(A) {
    return SimileAjax.History._plainDocumentTitle + " {" + A + "}";
};
SimileAjax.History.initialize = function() {
    if (SimileAjax.History._initialized) {
        return;
    }
    if (SimileAjax.History.enabled) {
        var A = document.createElement("iframe");
        A.id = "simile-ajax-history";
        A.style.position = "absolute";
        A.style.width = "10px";
        A.style.height = "10px";
        A.style.top = "0px";
        A.style.left = "0px";
        A.style.visibility = "hidden";
        A.src = SimileAjax.History.historyFile + "?0";
        document.body.appendChild(A);
        SimileAjax.DOM.registerEvent(A, "load", SimileAjax.History._handleIFrameOnLoad);
        SimileAjax.History._iframe = A;
    }
    SimileAjax.History._initialized = true;
};
SimileAjax.History.addListener = function(A) {
    SimileAjax.History.initialize();
    SimileAjax.History._listeners.add(A);
};
SimileAjax.History.removeListener = function(A) {
    SimileAjax.History.initialize();
    SimileAjax.History._listeners.remove(A);
};
SimileAjax.History.addAction = function(A) {
    SimileAjax.History.initialize();
    SimileAjax.History._listeners.fire("onBeforePerform", [A]);
    window.setTimeout(function() {
        try {
            A.perform();
            SimileAjax.History._listeners.fire("onAfterPerform", [A]);
            if (SimileAjax.History.enabled) {
                SimileAjax.History._actions = SimileAjax.History._actions.slice(0, SimileAjax.History._currentIndex - SimileAjax.History._baseIndex);
                SimileAjax.History._actions.push(A);
                SimileAjax.History._currentIndex++;
                var C = SimileAjax.History._actions.length - SimileAjax.History.maxHistoryLength;
                if (C > 0) {
                    SimileAjax.History._actions = SimileAjax.History._actions.slice(C);
                    SimileAjax.History._baseIndex += C;
                }
                try {
                    SimileAjax.History._iframe.contentWindow.location.search = "?" + SimileAjax.History._currentIndex;
                } catch(B) {
                    var D = SimileAjax.History.formatHistoryEntryTitle(A.label);
                    document.title = D;
                }
            }
        } catch(B) {
            SimileAjax.Debug.exception(B, "Error adding action {" + A.label + "} to history");
        }
    }, 0);
};
SimileAjax.History.addLengthyAction = function(B, A, C) {
    SimileAjax.History.addAction({perform:B,undo:A,label:C,uiLayer:SimileAjax.WindowManager.getBaseLayer(),lengthy:true});
};
SimileAjax.History._handleIFrameOnLoad = function() {
    try {
        var B = SimileAjax.History._iframe.contentWindow.location.search;
        var F = (B.length == 0) ? 0 : Math.max(0, parseInt(B.substr(1)));
        var D = function() {
            var G = F - SimileAjax.History._currentIndex;
            SimileAjax.History._currentIndex += G;
            SimileAjax.History._baseIndex += G;
            SimileAjax.History._iframe.contentWindow.location.search = "?" + F;
        };
        if (F < SimileAjax.History._currentIndex) {
            SimileAjax.History._listeners.fire("onBeforeUndoSeveral", []);
            window.setTimeout(function() {
                while (SimileAjax.History._currentIndex > F && SimileAjax.History._currentIndex > SimileAjax.History._baseIndex) {
                    SimileAjax.History._currentIndex--;
                    var G = SimileAjax.History._actions[SimileAjax.History._currentIndex - SimileAjax.History._baseIndex];
                    try {
                        G.undo();
                    } catch(H) {
                        SimileAjax.Debug.exception(H, "History: Failed to undo action {" + G.label + "}");
                    }
                }
                SimileAjax.History._listeners.fire("onAfterUndoSeveral", []);
                D();
            }, 0);
        } else {
            if (F > SimileAjax.History._currentIndex) {
                SimileAjax.History._listeners.fire("onBeforeRedoSeveral", []);
                window.setTimeout(function() {
                    while (SimileAjax.History._currentIndex < F && SimileAjax.History._currentIndex - SimileAjax.History._baseIndex < SimileAjax.History._actions.length) {
                        var G = SimileAjax.History._actions[SimileAjax.History._currentIndex - SimileAjax.History._baseIndex];
                        try {
                            G.perform();
                        } catch(H) {
                            SimileAjax.Debug.exception(H, "History: Failed to redo action {" + G.label + "}");
                        }
                        SimileAjax.History._currentIndex++;
                    }
                    SimileAjax.History._listeners.fire("onAfterRedoSeveral", []);
                    D();
                }, 0);
            } else {
                var A = SimileAjax.History._currentIndex - SimileAjax.History._baseIndex - 1;
                var E = (A >= 0 && A < SimileAjax.History._actions.length) ? SimileAjax.History.formatHistoryEntryTitle(SimileAjax.History._actions[A].label) : SimileAjax.History._plainDocumentTitle;
                SimileAjax.History._iframe.contentWindow.document.title = E;
                document.title = E;
            }
        }
    } catch(C) {
    }
};
SimileAjax.History.getNextUndoAction = function() {
    try {
        var A = SimileAjax.History._currentIndex - SimileAjax.History._baseIndex - 1;
        return SimileAjax.History._actions[A];
    } catch(B) {
        return null;
    }
};
SimileAjax.History.getNextRedoAction = function() {
    try {
        var A = SimileAjax.History._currentIndex - SimileAjax.History._baseIndex;
        return SimileAjax.History._actions[A];
    } catch(B) {
        return null;
    }
};


/* html.js */
SimileAjax.HTML = new Object();
SimileAjax.HTML._e2uHash = {};
(function() {
    var A = SimileAjax.HTML._e2uHash;
    A["nbsp"] = "\u00A0[space]";
    A["iexcl"] = "\u00A1";
    A["cent"] = "\u00A2";
    A["pound"] = "\u00A3";
    A["curren"] = "\u00A4";
    A["yen"] = "\u00A5";
    A["brvbar"] = "\u00A6";
    A["sect"] = "\u00A7";
    A["uml"] = "\u00A8";
    A["copy"] = "\u00A9";
    A["ordf"] = "\u00AA";
    A["laquo"] = "\u00AB";
    A["not"] = "\u00AC";
    A["shy"] = "\u00AD";
    A["reg"] = "\u00AE";
    A["macr"] = "\u00AF";
    A["deg"] = "\u00B0";
    A["plusmn"] = "\u00B1";
    A["sup2"] = "\u00B2";
    A["sup3"] = "\u00B3";
    A["acute"] = "\u00B4";
    A["micro"] = "\u00B5";
    A["para"] = "\u00B6";
    A["middot"] = "\u00B7";
    A["cedil"] = "\u00B8";
    A["sup1"] = "\u00B9";
    A["ordm"] = "\u00BA";
    A["raquo"] = "\u00BB";
    A["frac14"] = "\u00BC";
    A["frac12"] = "\u00BD";
    A["frac34"] = "\u00BE";
    A["iquest"] = "\u00BF";
    A["Agrave"] = "\u00C0";
    A["Aacute"] = "\u00C1";
    A["Acirc"] = "\u00C2";
    A["Atilde"] = "\u00C3";
    A["Auml"] = "\u00C4";
    A["Aring"] = "\u00C5";
    A["AElig"] = "\u00C6";
    A["Ccedil"] = "\u00C7";
    A["Egrave"] = "\u00C8";
    A["Eacute"] = "\u00C9";
    A["Ecirc"] = "\u00CA";
    A["Euml"] = "\u00CB";
    A["Igrave"] = "\u00CC";
    A["Iacute"] = "\u00CD";
    A["Icirc"] = "\u00CE";
    A["Iuml"] = "\u00CF";
    A["ETH"] = "\u00D0";
    A["Ntilde"] = "\u00D1";
    A["Ograve"] = "\u00D2";
    A["Oacute"] = "\u00D3";
    A["Ocirc"] = "\u00D4";
    A["Otilde"] = "\u00D5";
    A["Ouml"] = "\u00D6";
    A["times"] = "\u00D7";
    A["Oslash"] = "\u00D8";
    A["Ugrave"] = "\u00D9";
    A["Uacute"] = "\u00DA";
    A["Ucirc"] = "\u00DB";
    A["Uuml"] = "\u00DC";
    A["Yacute"] = "\u00DD";
    A["THORN"] = "\u00DE";
    A["szlig"] = "\u00DF";
    A["agrave"] = "\u00E0";
    A["aacute"] = "\u00E1";
    A["acirc"] = "\u00E2";
    A["atilde"] = "\u00E3";
    A["auml"] = "\u00E4";
    A["aring"] = "\u00E5";
    A["aelig"] = "\u00E6";
    A["ccedil"] = "\u00E7";
    A["egrave"] = "\u00E8";
    A["eacute"] = "\u00E9";
    A["ecirc"] = "\u00EA";
    A["euml"] = "\u00EB";
    A["igrave"] = "\u00EC";
    A["iacute"] = "\u00ED";
    A["icirc"] = "\u00EE";
    A["iuml"] = "\u00EF";
    A["eth"] = "\u00F0";
    A["ntilde"] = "\u00F1";
    A["ograve"] = "\u00F2";
    A["oacute"] = "\u00F3";
    A["ocirc"] = "\u00F4";
    A["otilde"] = "\u00F5";
    A["ouml"] = "\u00F6";
    A["divide"] = "\u00F7";
    A["oslash"] = "\u00F8";
    A["ugrave"] = "\u00F9";
    A["uacute"] = "\u00FA";
    A["ucirc"] = "\u00FB";
    A["uuml"] = "\u00FC";
    A["yacute"] = "\u00FD";
    A["thorn"] = "\u00FE";
    A["yuml"] = "\u00FF";
    A["quot"] = "\u0022";
    A["amp"] = "\u0026";
    A["lt"] = "\u003C";
    A["gt"] = "\u003E";
    A["OElig"] = "";
    A["oelig"] = "\u0153";
    A["Scaron"] = "\u0160";
    A["scaron"] = "\u0161";
    A["Yuml"] = "\u0178";
    A["circ"] = "\u02C6";
    A["tilde"] = "\u02DC";
    A["ensp"] = "\u2002";
    A["emsp"] = "\u2003";
    A["thinsp"] = "\u2009";
    A["zwnj"] = "\u200C";
    A["zwj"] = "\u200D";
    A["lrm"] = "\u200E";
    A["rlm"] = "\u200F";
    A["ndash"] = "\u2013";
    A["mdash"] = "\u2014";
    A["lsquo"] = "\u2018";
    A["rsquo"] = "\u2019";
    A["sbquo"] = "\u201A";
    A["ldquo"] = "\u201C";
    A["rdquo"] = "\u201D";
    A["bdquo"] = "\u201E";
    A["dagger"] = "\u2020";
    A["Dagger"] = "\u2021";
    A["permil"] = "\u2030";
    A["lsaquo"] = "\u2039";
    A["rsaquo"] = "\u203A";
    A["euro"] = "\u20AC";
    A["fnof"] = "\u0192";
    A["Alpha"] = "\u0391";
    A["Beta"] = "\u0392";
    A["Gamma"] = "\u0393";
    A["Delta"] = "\u0394";
    A["Epsilon"] = "\u0395";
    A["Zeta"] = "\u0396";
    A["Eta"] = "\u0397";
    A["Theta"] = "\u0398";
    A["Iota"] = "\u0399";
    A["Kappa"] = "\u039A";
    A["Lambda"] = "\u039B";
    A["Mu"] = "\u039C";
    A["Nu"] = "\u039D";
    A["Xi"] = "\u039E";
    A["Omicron"] = "\u039F";
    A["Pi"] = "\u03A0";
    A["Rho"] = "\u03A1";
    A["Sigma"] = "\u03A3";
    A["Tau"] = "\u03A4";
    A["Upsilon"] = "\u03A5";
    A["Phi"] = "\u03A6";
    A["Chi"] = "\u03A7";
    A["Psi"] = "\u03A8";
    A["Omega"] = "\u03A9";
    A["alpha"] = "\u03B1";
    A["beta"] = "\u03B2";
    A["gamma"] = "\u03B3";
    A["delta"] = "\u03B4";
    A["epsilon"] = "\u03B5";
    A["zeta"] = "\u03B6";
    A["eta"] = "\u03B7";
    A["theta"] = "\u03B8";
    A["iota"] = "\u03B9";
    A["kappa"] = "\u03BA";
    A["lambda"] = "\u03BB";
    A["mu"] = "\u03BC";
    A["nu"] = "\u03BD";
    A["xi"] = "\u03BE";
    A["omicron"] = "\u03BF";
    A["pi"] = "\u03C0";
    A["rho"] = "\u03C1";
    A["sigmaf"] = "\u03C2";
    A["sigma"] = "\u03C3";
    A["tau"] = "\u03C4";
    A["upsilon"] = "\u03C5";
    A["phi"] = "\u03C6";
    A["chi"] = "\u03C7";
    A["psi"] = "\u03C8";
    A["omega"] = "\u03C9";
    A["thetasym"] = "\u03D1";
    A["upsih"] = "\u03D2";
    A["piv"] = "\u03D6";
    A["bull"] = "\u2022";
    A["hellip"] = "\u2026";
    A["prime"] = "\u2032";
    A["Prime"] = "\u2033";
    A["oline"] = "\u203E";
    A["frasl"] = "\u2044";
    A["weierp"] = "\u2118";
    A["image"] = "\u2111";
    A["real"] = "\u211C";
    A["trade"] = "\u2122";
    A["alefsym"] = "\u2135";
    A["larr"] = "\u2190";
    A["uarr"] = "\u2191";
    A["rarr"] = "\u2192";
    A["darr"] = "\u2193";
    A["harr"] = "\u2194";
    A["crarr"] = "\u21B5";
    A["lArr"] = "\u21D0";
    A["uArr"] = "\u21D1";
    A["rArr"] = "\u21D2";
    A["dArr"] = "\u21D3";
    A["hArr"] = "\u21D4";
    A["forall"] = "\u2200";
    A["part"] = "\u2202";
    A["exist"] = "\u2203";
    A["empty"] = "\u2205";
    A["nabla"] = "\u2207";
    A["isin"] = "\u2208";
    A["notin"] = "\u2209";
    A["ni"] = "\u220B";
    A["prod"] = "\u220F";
    A["sum"] = "\u2211";
    A["minus"] = "\u2212";
    A["lowast"] = "\u2217";
    A["radic"] = "\u221A";
    A["prop"] = "\u221D";
    A["infin"] = "\u221E";
    A["ang"] = "\u2220";
    A["and"] = "\u2227";
    A["or"] = "\u2228";
    A["cap"] = "\u2229";
    A["cup"] = "\u222A";
    A["int"] = "\u222B";
    A["there4"] = "\u2234";
    A["sim"] = "\u223C";
    A["cong"] = "\u2245";
    A["asymp"] = "\u2248";
    A["ne"] = "\u2260";
    A["equiv"] = "\u2261";
    A["le"] = "\u2264";
    A["ge"] = "\u2265";
    A["sub"] = "\u2282";
    A["sup"] = "\u2283";
    A["nsub"] = "\u2284";
    A["sube"] = "\u2286";
    A["supe"] = "\u2287";
    A["oplus"] = "\u2295";
    A["otimes"] = "\u2297";
    A["perp"] = "\u22A5";
    A["sdot"] = "\u22C5";
    A["lceil"] = "\u2308";
    A["rceil"] = "\u2309";
    A["lfloor"] = "\u230A";
    A["rfloor"] = "\u230B";
    A["lang"] = "\u2329";
    A["rang"] = "\u232A";
    A["loz"] = "\u25CA";
    A["spades"] = "\u2660";
    A["clubs"] = "\u2663";
    A["hearts"] = "\u2665";
    A["diams"] = "\u2666";
})();
SimileAjax.HTML.deEntify = function(C) {
    var D = SimileAjax.HTML._e2uHash;
    var B = /&(\w+?);/;
    while (B.test(C)) {
        var A = C.match(B);
        C = C.replace(B, D[A[1]]);
    }
    return C;
};


/* json.js */
SimileAjax.JSON = new Object();
(function() {
    var m = {"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
    var s = {array:function(x) {
        var a = ["["],b,f,i,l = x.length,v;
        for (i = 0;
             i < l;
             i += 1) {
            v = x[i];
            f = s[typeof v];
            if (f) {
                v = f(v);
                if (typeof v == "string") {
                    if (b) {
                        a[a.length] = ",";
                    }
                    a[a.length] = v;
                    b = true;
                }
            }
        }
        a[a.length] = "]";
        return a.join("");
    },"boolean":function(x) {
        return String(x);
    },"null":function(x) {
        return"null";
    },number:function(x) {
        return isFinite(x) ? String(x) : "null";
    },object:function(x) {
        if (x) {
            if (x instanceof Array) {
                return s.array(x);
            }
            var a = ["{"],b,f,i,v;
            for (i in x) {
                v = x[i];
                f = s[typeof v];
                if (f) {
                    v = f(v);
                    if (typeof v == "string") {
                        if (b) {
                            a[a.length] = ",";
                        }
                        a.push(s.string(i), ":", v);
                        b = true;
                    }
                }
            }
            a[a.length] = "}";
            return a.join("");
        }
        return"null";
    },string:function(x) {
        if (/["\\\x00-\x1f]/.test(x)) {
            x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if (c) {
                    return c;
                }
                c = b.charCodeAt();
                return"\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            });
        }
        return'"' + x + '"';
    }};
    SimileAjax.JSON.toJSONString = function(o) {
        if (o instanceof Object) {
            return s.object(o);
        } else {
            if (o instanceof Array) {
                return s.array(o);
            } else {
                return o.toString();
            }
        }
    };
    SimileAjax.JSON.parseJSON = function() {
        try {
            return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(this.replace(/"(\\.|[^"\\])*"/g, ""))) && eval("(" + this + ")");
        } catch(e) {
            return false;
        }
    };
})();

/* units.js */
SimileAjax.NativeDateUnit = new Object();
SimileAjax.NativeDateUnit.makeDefaultValue = function() {
    return new Date();
};
SimileAjax.NativeDateUnit.cloneValue = function(A) {
    return new Date(A.getTime());
};
SimileAjax.NativeDateUnit.getParser = function(A) {
    if (typeof A == "string") {
        A = A.toLowerCase();
    }
    return(A == "iso8601" || A == "iso 8601") ? SimileAjax.DateTime.parseIso8601DateTime : SimileAjax.DateTime.parseGregorianDateTime;
};
SimileAjax.NativeDateUnit.parseFromObject = function(A) {
    return SimileAjax.DateTime.parseGregorianDateTime(A);
};
SimileAjax.NativeDateUnit.toNumber = function(A) {
    return A.getTime();
};
SimileAjax.NativeDateUnit.fromNumber = function(A) {
    return new Date(A);
};
SimileAjax.NativeDateUnit.compare = function(D, C) {
    var B,A;
    if (typeof D == "object") {
        B = D.getTime();
    } else {
        B = Number(D);
    }
    if (typeof C == "object") {
        A = C.getTime();
    } else {
        A = Number(C);
    }
    return B - A;
};
SimileAjax.NativeDateUnit.earlier = function(B, A) {
    return SimileAjax.NativeDateUnit.compare(B, A) < 0 ? B : A;
};
SimileAjax.NativeDateUnit.later = function(B, A) {
    return SimileAjax.NativeDateUnit.compare(B, A) > 0 ? B : A;
};
SimileAjax.NativeDateUnit.change = function(A, B) {
    return new Date(A.getTime() + B);
};


/* window-manager.js */
SimileAjax.WindowManager = {_initialized:false,_listeners:[],_draggedElement:null,_draggedElementCallback:null,_dropTargetHighlightElement:null,_lastCoords:null,_ghostCoords:null,_draggingMode:"",_dragging:false,_layers:[]};
SimileAjax.WindowManager.initialize = function() {
    if (SimileAjax.WindowManager._initialized) {
        return;
    }
    SimileAjax.DOM.registerEvent(document.body, "mousedown", SimileAjax.WindowManager._onBodyMouseDown);
    SimileAjax.DOM.registerEvent(document.body, "mousemove", SimileAjax.WindowManager._onBodyMouseMove);
    SimileAjax.DOM.registerEvent(document.body, "mouseup", SimileAjax.WindowManager._onBodyMouseUp);
    SimileAjax.DOM.registerEvent(document, "keydown", SimileAjax.WindowManager._onBodyKeyDown);
    SimileAjax.DOM.registerEvent(document, "keyup", SimileAjax.WindowManager._onBodyKeyUp);
    SimileAjax.WindowManager._layers.push({index:0});
    SimileAjax.WindowManager._historyListener = {onBeforeUndoSeveral:function() {
    },onAfterUndoSeveral:function() {
    },onBeforeUndo:function() {
    },onAfterUndo:function() {
    },onBeforeRedoSeveral:function() {
    },onAfterRedoSeveral:function() {
    },onBeforeRedo:function() {
    },onAfterRedo:function() {
    }};
    SimileAjax.History.addListener(SimileAjax.WindowManager._historyListener);
    SimileAjax.WindowManager._initialized = true;
};
SimileAjax.WindowManager.getBaseLayer = function() {
    SimileAjax.WindowManager.initialize();
    return SimileAjax.WindowManager._layers[0];
};
SimileAjax.WindowManager.getHighestLayer = function() {
    SimileAjax.WindowManager.initialize();
    return SimileAjax.WindowManager._layers[SimileAjax.WindowManager._layers.length - 1];
};
SimileAjax.WindowManager.registerEventWithObject = function(D, A, E, B, C) {
    SimileAjax.WindowManager.registerEvent(D, A, function(G, F, H) {
        return E[B].call(E, G, F, H);
    }, C);
};
SimileAjax.WindowManager.registerEvent = function(D, B, E, C) {
    if (C == null) {
        C = SimileAjax.WindowManager.getHighestLayer();
    }
    var A = function(G, F, I) {
        if (SimileAjax.WindowManager._canProcessEventAtLayer(C)) {
            SimileAjax.WindowManager._popToLayer(C.index);
            try {
                E(G, F, I);
            } catch(H) {
                SimileAjax.Debug.exception(H);
            }
        }
        SimileAjax.DOM.cancelEvent(F);
        return false;
    };
    SimileAjax.DOM.registerEvent(D, B, A);
};
SimileAjax.WindowManager.pushLayer = function(C, D, B) {
    var A = {onPop:C,index:SimileAjax.WindowManager._layers.length,ephemeral:(D),elmt:B};
    SimileAjax.WindowManager._layers.push(A);
    return A;
};
SimileAjax.WindowManager.popLayer = function(B) {
    for (var A = 1;
         A < SimileAjax.WindowManager._layers.length;
         A++) {
        if (SimileAjax.WindowManager._layers[A] == B) {
            SimileAjax.WindowManager._popToLayer(A - 1);
            break;
        }
    }
};
SimileAjax.WindowManager.popAllLayers = function() {
    SimileAjax.WindowManager._popToLayer(0);
};
SimileAjax.WindowManager.registerForDragging = function(B, C, A) {
    SimileAjax.WindowManager.registerEvent(B, "mousedown", function(E, D, F) {
        SimileAjax.WindowManager._handleMouseDown(E, D, C);
    }, A);
};
SimileAjax.WindowManager._popToLayer = function(C) {
    while (C + 1 < SimileAjax.WindowManager._layers.length) {
        try {
            var A = SimileAjax.WindowManager._layers.pop();
            if (A.onPop != null) {
                A.onPop();
            }
        } catch(B) {
        }
    }
};
SimileAjax.WindowManager._canProcessEventAtLayer = function(B) {
    if (B.index == (SimileAjax.WindowManager._layers.length - 1)) {
        return true;
    }
    for (var A = B.index + 1;
         A < SimileAjax.WindowManager._layers.length;
         A++) {
        if (!SimileAjax.WindowManager._layers[A].ephemeral) {
            return false;
        }
    }
    return true;
};
SimileAjax.WindowManager.cancelPopups = function(A) {
    var F = (A) ? SimileAjax.DOM.getEventPageCoordinates(A) : {x:-1,y:-1};
    var E = SimileAjax.WindowManager._layers.length - 1;
    while (E > 0 && SimileAjax.WindowManager._layers[E].ephemeral) {
        var D = SimileAjax.WindowManager._layers[E];
        if (D.elmt != null) {
            var C = D.elmt;
            var B = SimileAjax.DOM.getPageCoordinates(C);
            if (F.x >= B.left && F.x < (B.left + C.offsetWidth) && F.y >= B.top && F.y < (B.top + C.offsetHeight)) {
                break;
            }
        }
        E--;
    }
    SimileAjax.WindowManager._popToLayer(E);
};
SimileAjax.WindowManager._onBodyMouseDown = function(B, A, C) {
    if (!("eventPhase" in A) || A.eventPhase == A.BUBBLING_PHASE) {
        SimileAjax.WindowManager.cancelPopups(A);
    }
};
SimileAjax.WindowManager._handleMouseDown = function(B, A, C) {
    SimileAjax.WindowManager._draggedElement = B;
    SimileAjax.WindowManager._draggedElementCallback = C;
    SimileAjax.WindowManager._lastCoords = {x:A.clientX,y:A.clientY};
    SimileAjax.DOM.cancelEvent(A);
    return false;
};
SimileAjax.WindowManager._onBodyKeyDown = function(C, A, D) {
    if (SimileAjax.WindowManager._dragging) {
        if (A.keyCode == 27) {
            SimileAjax.WindowManager._cancelDragging();
        } else {
            if ((A.keyCode == 17 || A.keyCode == 16) && SimileAjax.WindowManager._draggingMode != "copy") {
                SimileAjax.WindowManager._draggingMode = "copy";
                var B = SimileAjax.Graphics.createTranslucentImage(SimileAjax.urlPrefix + "images/copy.png");
                B.style.position = "absolute";
                B.style.left = (SimileAjax.WindowManager._ghostCoords.left - 16) + "px";
                B.style.top = (SimileAjax.WindowManager._ghostCoords.top) + "px";
                document.body.appendChild(B);
                SimileAjax.WindowManager._draggingModeIndicatorElmt = B;
            }
        }
    }
};
SimileAjax.WindowManager._onBodyKeyUp = function(B, A, C) {
    if (SimileAjax.WindowManager._dragging) {
        if (A.keyCode == 17 || A.keyCode == 16) {
            SimileAjax.WindowManager._draggingMode = "";
            if (SimileAjax.WindowManager._draggingModeIndicatorElmt != null) {
                document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
                SimileAjax.WindowManager._draggingModeIndicatorElmt = null;
            }
        }
    }
};
SimileAjax.WindowManager._onBodyMouseMove = function(C, M, B) {
    if (SimileAjax.WindowManager._draggedElement != null) {
        var L = SimileAjax.WindowManager._draggedElementCallback;
        var G = SimileAjax.WindowManager._lastCoords;
        var J = M.clientX - G.x;
        var I = M.clientY - G.y;
        if (!SimileAjax.WindowManager._dragging) {
            if (Math.abs(J) > 5 || Math.abs(I) > 5) {
                try {
                    if ("onDragStart" in L) {
                        L.onDragStart();
                    }
                    if ("ghost" in L && L.ghost) {
                        var P = SimileAjax.WindowManager._draggedElement;
                        SimileAjax.WindowManager._ghostCoords = SimileAjax.DOM.getPageCoordinates(P);
                        SimileAjax.WindowManager._ghostCoords.left += J;
                        SimileAjax.WindowManager._ghostCoords.top += I;
                        var K = P.cloneNode(true);
                        K.style.position = "absolute";
                        K.style.left = SimileAjax.WindowManager._ghostCoords.left + "px";
                        K.style.top = SimileAjax.WindowManager._ghostCoords.top + "px";
                        K.style.zIndex = 1000;
                        SimileAjax.Graphics.setOpacity(K, 50);
                        document.body.appendChild(K);
                        L._ghostElmt = K;
                    }
                    SimileAjax.WindowManager._dragging = true;
                    SimileAjax.WindowManager._lastCoords = {x:M.clientX,y:M.clientY};
                    document.body.focus();
                } catch(H) {
                    SimileAjax.Debug.exception("WindowManager: Error handling mouse down", H);
                    SimileAjax.WindowManager._cancelDragging();
                }
            }
        } else {
            try {
                SimileAjax.WindowManager._lastCoords = {x:M.clientX,y:M.clientY};
                if ("onDragBy" in L) {
                    L.onDragBy(J, I);
                }
                if ("_ghostElmt" in L) {
                    var K = L._ghostElmt;
                    SimileAjax.WindowManager._ghostCoords.left += J;
                    SimileAjax.WindowManager._ghostCoords.top += I;
                    K.style.left = SimileAjax.WindowManager._ghostCoords.left + "px";
                    K.style.top = SimileAjax.WindowManager._ghostCoords.top + "px";
                    if (SimileAjax.WindowManager._draggingModeIndicatorElmt != null) {
                        var O = SimileAjax.WindowManager._draggingModeIndicatorElmt;
                        O.style.left = (SimileAjax.WindowManager._ghostCoords.left - 16) + "px";
                        O.style.top = SimileAjax.WindowManager._ghostCoords.top + "px";
                    }
                    if ("droppable" in L && L.droppable) {
                        var N = SimileAjax.DOM.getEventPageCoordinates(M);
                        var B = SimileAjax.DOM.hittest(N.x, N.y, [SimileAjax.WindowManager._ghostElmt,SimileAjax.WindowManager._dropTargetHighlightElement]);
                        B = SimileAjax.WindowManager._findDropTarget(B);
                        if (B != SimileAjax.WindowManager._potentialDropTarget) {
                            if (SimileAjax.WindowManager._dropTargetHighlightElement != null) {
                                document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
                                SimileAjax.WindowManager._dropTargetHighlightElement = null;
                                SimileAjax.WindowManager._potentialDropTarget = null;
                            }
                            var A = false;
                            if (B != null) {
                                if ((!("canDropOn" in L) || L.canDropOn(B)) && (!("canDrop" in B) || B.canDrop(SimileAjax.WindowManager._draggedElement))) {
                                    A = true;
                                }
                            }
                            if (A) {
                                var E = 4;
                                var D = SimileAjax.DOM.getPageCoordinates(B);
                                var F = document.createElement("div");
                                F.style.border = E + "px solid yellow";
                                F.style.backgroundColor = "yellow";
                                F.style.position = "absolute";
                                F.style.left = D.left + "px";
                                F.style.top = D.top + "px";
                                F.style.width = (B.offsetWidth - E * 2) + "px";
                                F.style.height = (B.offsetHeight - E * 2) + "px";
                                SimileAjax.Graphics.setOpacity(F, 30);
                                document.body.appendChild(F);
                                SimileAjax.WindowManager._potentialDropTarget = B;
                                SimileAjax.WindowManager._dropTargetHighlightElement = F;
                            }
                        }
                    }
                }
            } catch(H) {
                SimileAjax.Debug.exception("WindowManager: Error handling mouse move", H);
                SimileAjax.WindowManager._cancelDragging();
            }
        }
        SimileAjax.DOM.cancelEvent(M);
        return false;
    }
};
SimileAjax.WindowManager._onBodyMouseUp = function(B, A, E) {
    if (SimileAjax.WindowManager._draggedElement != null) {
        try {
            if (SimileAjax.WindowManager._dragging) {
                var C = SimileAjax.WindowManager._draggedElementCallback;
                if ("onDragEnd" in C) {
                    C.onDragEnd();
                }
                if ("droppable" in C && C.droppable) {
                    var D = false;
                    var E = SimileAjax.WindowManager._potentialDropTarget;
                    if (E != null) {
                        if ((!("canDropOn" in C) || C.canDropOn(E)) && (!("canDrop" in E) || E.canDrop(SimileAjax.WindowManager._draggedElement))) {
                            if ("onDropOn" in C) {
                                C.onDropOn(E);
                            }
                            E.ondrop(SimileAjax.WindowManager._draggedElement, SimileAjax.WindowManager._draggingMode);
                            D = true;
                        }
                    }
                    if (!D) {
                    }
                }
            }
        } finally {
            SimileAjax.WindowManager._cancelDragging();
        }
        SimileAjax.DOM.cancelEvent(A);
        return false;
    }
};
SimileAjax.WindowManager._cancelDragging = function() {
    var A = SimileAjax.WindowManager._draggedElementCallback;
    if ("_ghostElmt" in A) {
        var B = A._ghostElmt;
        document.body.removeChild(B);
        delete A._ghostElmt;
    }
    if (SimileAjax.WindowManager._dropTargetHighlightElement != null) {
        document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
        SimileAjax.WindowManager._dropTargetHighlightElement = null;
    }
    if (SimileAjax.WindowManager._draggingModeIndicatorElmt != null) {
        document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
        SimileAjax.WindowManager._draggingModeIndicatorElmt = null;
    }
    SimileAjax.WindowManager._draggedElement = null;
    SimileAjax.WindowManager._draggedElementCallback = null;
    SimileAjax.WindowManager._potentialDropTarget = null;
    SimileAjax.WindowManager._dropTargetHighlightElement = null;
    SimileAjax.WindowManager._lastCoords = null;
    SimileAjax.WindowManager._ghostCoords = null;
    SimileAjax.WindowManager._draggingMode = "";
    SimileAjax.WindowManager._dragging = false;
};
SimileAjax.WindowManager._findDropTarget = function(A) {
    while (A != null) {
        if ("ondrop" in A && (typeof A.ondrop) == "function") {
            break;
        }
        A = A.parentNode;
    }
    return A;
};


/* xmlhttp.js */
SimileAjax.XmlHttp = new Object();
SimileAjax.XmlHttp._onReadyStateChange = function(A, D, B) {
    switch (A.readyState) {
        case 4:
            try {
                if (A.status == 0 || A.status == 200) {
                    if (B) {
                        B(A);
                    }
                } else {
                    if (D) {
                        D(A.statusText, A.status, A);
                    }
                }
            } catch(C) {
                SimileAjax.Debug.exception("XmlHttp: Error handling onReadyStateChange", C);
            }
            break;
    }
};
SimileAjax.XmlHttp._createRequest = function() {
    if (SimileAjax.Platform.browser.isIE) {
        var B = ["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
        for (var C = 0;
             C < B.length;
             C++) {
            try {
                var A = B[C];
                var D = function() {
                    return new ActiveXObject(A);
                };
                var F = D();
                SimileAjax.XmlHttp._createRequest = D;
                return F;
            } catch(E) {
            }
        }
    }
    try {
        var D = function() {
            return new XMLHttpRequest();
        };
        var F = D();
        SimileAjax.XmlHttp._createRequest = D;
        return F;
    } catch(E) {
        throw new Error("Failed to create an XMLHttpRequest object");
    }
};
SimileAjax.XmlHttp.get = function(B, D, C) {
    var A = SimileAjax.XmlHttp._createRequest();
    A.open("GET", B, true);
    A.onreadystatechange = function() {
        SimileAjax.XmlHttp._onReadyStateChange(A, D, C);
    };
    A.send(null);
};
SimileAjax.XmlHttp.post = function(C, A, E, D) {
    var B = SimileAjax.XmlHttp._createRequest();
    B.open("POST", C, true);
    B.onreadystatechange = function() {
        SimileAjax.XmlHttp._onReadyStateChange(B, E, D);
    };
    B.send(A);
};
SimileAjax.XmlHttp._forceXML = function(A) {
    try {
        A.overrideMimeType("text/xml");
    } catch(B) {
        A.setrequestheader("Content-Type", "text/xml");
    }
};
