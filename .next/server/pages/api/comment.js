"use strict";
(() => {
var exports = {};
exports.id = 74;
exports.ids = [74];
exports.modules = {

/***/ 5611:
/***/ ((module) => {

module.exports = import("nanoid");;

/***/ }),

/***/ 4361:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const clearUrl = (url)=>{
    const { origin, pathname } = new URL(url);
    return `${origin}${pathname}`;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clearUrl);


/***/ }),

/***/ 6830:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ createComments)
/* harmony export */ });
/* harmony import */ var _redis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8219);
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5611);
/* harmony import */ var _getUser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(472);
/* harmony import */ var _clearUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4361);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([nanoid__WEBPACK_IMPORTED_MODULE_1__]);
nanoid__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




async function createComments(req, res) {
    const url = (0,_clearUrl__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(req.headers.referer);
    const { text } = req.body;
    const { authorization } = req.headers;
    if (!text || !authorization) {
        return res.status(400).json({
            message: "Missing parameter."
        });
    }
    if (!_redis__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z) {
        return res.status(400).json({
            message: "Failed to connect to redis client."
        });
    }
    try {
        // verify user token
        const user = await (0,_getUser__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)(authorization);
        if (!user) return res.status(400).json({
            message: "Need authorization."
        });
        const { name, picture, sub, email } = user;
        const comment = {
            id: (0,nanoid__WEBPACK_IMPORTED_MODULE_1__.nanoid)(),
            created_at: Date.now(),
            url,
            text,
            user: {
                name,
                picture,
                sub,
                email
            }
        };
        // write data
        await _redis__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.lpush(url, JSON.stringify(comment));
        return res.status(200).json(comment);
    } catch (_) {
        return res.status(400).json({
            message: "Unexpected error occurred."
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1222:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ deleteComments)
/* harmony export */ });
/* harmony import */ var _redis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8219);
/* harmony import */ var _getUser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(472);
/* harmony import */ var _clearUrl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4361);



async function deleteComments(req, res) {
    const url = (0,_clearUrl__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(req.headers.referer);
    const { comment } = req.body;
    const { authorization } = req.headers;
    if (!comment || !authorization) {
        return res.status(400).json({
            message: "Missing parameter."
        });
    }
    if (!_redis__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z) {
        return res.status(500).json({
            message: "Failed to connect to redis."
        });
    }
    try {
        // verify user token
        const user = await (0,_getUser__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(authorization);
        if (!user) return res.status(400).json({
            message: "Invalid token."
        });
        comment.user.email = user.email;
        const isAdmin = process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL === user.email;
        const isAuthor = user.sub === comment.user.sub;
        if (!isAdmin && !isAuthor) {
            return res.status(400).json({
                message: "Need authorization."
            });
        }
        // delete
        await _redis__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.lrem(url, 0, JSON.stringify(comment));
        return res.status(200).end();
    } catch (err) {
        return res.status(400);
    }
}


/***/ }),

/***/ 3281:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ fetchComment)
/* harmony export */ });
/* harmony import */ var _redis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8219);
/* harmony import */ var _clearUrl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4361);


async function fetchComment(req, res) {
    const url = (0,_clearUrl__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(req.headers.referer);
    if (!_redis__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z) {
        return res.status(500).json({
            message: "Failed to connect to redis."
        });
    }
    try {
        // get data
        const rawComments = await _redis__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.lrange(url, 0, -1);
        // string data to object
        const comments = rawComments.map((c)=>{
            const comment = JSON.parse(c);
            delete comment.user.email;
            return comment;
        });
        return res.status(200).json(comments);
    } catch (_) {
        return res.status(400).json({
            message: "Unexpected error occurred."
        });
    }
}


/***/ }),

/***/ 472:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ getUser)
/* harmony export */ });
async function getUser(token) {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return await response.json();
}


/***/ }),

/***/ 8219:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ redis)
});

;// CONCATENATED MODULE: external "ioredis"
const external_ioredis_namespaceObject = require("ioredis");
var external_ioredis_default = /*#__PURE__*/__webpack_require__.n(external_ioredis_namespaceObject);
;// CONCATENATED MODULE: ./lib/redis.ts

function fixUrl(url) {
    if (!url) {
        return "";
    }
    if (url.startsWith("redis://") && !url.startsWith("redis://:")) {
        return url.replace("redis://", "redis://:");
    }
    if (url.startsWith("rediss://") && !url.startsWith("rediss://:")) {
        return url.replace("rediss://", "rediss://:");
    }
    return url;
}
class ClientRedis {
    constructor(){
        throw new Error("Use Singleton.getInstance()");
    }
    static getInstance() {
        if (!ClientRedis.instance) {
            ClientRedis.instance = new (external_ioredis_default())(fixUrl(process.env.REDIS_URL));
        }
        return ClientRedis.instance;
    }
}
/* harmony default export */ const redis = (ClientRedis.getInstance());


/***/ }),

/***/ 7431:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _lib_fetchComment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3281);
/* harmony import */ var _lib_createComment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6830);
/* harmony import */ var _lib_deleteComment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1222);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_createComment__WEBPACK_IMPORTED_MODULE_1__]);
_lib_createComment__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



async function handler(req, res) {
    switch(req.method){
        case "GET":
            return (0,_lib_fetchComment__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(req, res);
        case "POST":
            return (0,_lib_createComment__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(req, res);
        case "DELETE":
            return (0,_lib_deleteComment__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(req, res);
        default:
            return res.status(400).json({
                message: "Invalid method."
            });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(7431));
module.exports = __webpack_exports__;

})();