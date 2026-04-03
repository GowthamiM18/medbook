"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/appointments/route";
exports.ids = ["app/api/appointments/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fappointments%2Froute&page=%2Fapi%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fappointments%2Froute.ts&appDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fappointments%2Froute&page=%2Fapi%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fappointments%2Froute.ts&appDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_lenovo_Downloads_medbook_ai_medbook_src_app_api_appointments_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/appointments/route.ts */ \"(rsc)/./src/app/api/appointments/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/appointments/route\",\n        pathname: \"/api/appointments\",\n        filename: \"route\",\n        bundlePath: \"app/api/appointments/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\lenovo\\\\Downloads\\\\medbook-ai\\\\medbook\\\\src\\\\app\\\\api\\\\appointments\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_lenovo_Downloads_medbook_ai_medbook_src_app_api_appointments_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/appointments/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhcHBvaW50bWVudHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmFwcG9pbnRtZW50cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmFwcG9pbnRtZW50cyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNsZW5vdm8lNUNEb3dubG9hZHMlNUNtZWRib29rLWFpJTVDbWVkYm9vayU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDbGVub3ZvJTVDRG93bmxvYWRzJTVDbWVkYm9vay1haSU1Q21lZGJvb2smaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3dDO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWVkYm9vay1haS8/ZDczNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxsZW5vdm9cXFxcRG93bmxvYWRzXFxcXG1lZGJvb2stYWlcXFxcbWVkYm9va1xcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxhcHBvaW50bWVudHNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FwcG9pbnRtZW50cy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2FwcG9pbnRtZW50c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXBwb2ludG1lbnRzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcbGVub3ZvXFxcXERvd25sb2Fkc1xcXFxtZWRib29rLWFpXFxcXG1lZGJvb2tcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcYXBwb2ludG1lbnRzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hcHBvaW50bWVudHMvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fappointments%2Froute&page=%2Fapi%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fappointments%2Froute.ts&appDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/appointments/route.ts":
/*!*******************************************!*\
  !*** ./src/app/api/appointments/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _lib_appointment_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/appointment-token */ \"(rsc)/./src/lib/appointment-token.ts\");\n/* harmony import */ var _lib_phone__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/lib/phone */ \"(rsc)/./src/lib/phone.ts\");\n// src/app/api/appointments/route.ts\n\n\n\n\n\n\nasync function GET() {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    const appointments = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.appointment.findMany({\n        where: {\n            patientId: session.user.id\n        },\n        include: {\n            doctor: {\n                include: {\n                    user: true\n                }\n            },\n            slot: true\n        },\n        orderBy: {\n            createdAt: \"desc\"\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(appointments);\n}\nasync function POST(req) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: \"Unauthorized\"\n    }, {\n        status: 401\n    });\n    try {\n        const { doctorId, slotId, symptoms } = await req.json();\n        const slot = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.timeSlot.findUnique({\n            where: {\n                id: slotId\n            }\n        });\n        if (!slot || slot.isBooked) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Slot no longer available\"\n            }, {\n                status: 409\n            });\n        }\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n            where: {\n                id: session.user.id\n            },\n            select: {\n                phone: true\n            }\n        });\n        const patientPhone = (0,_lib_phone__WEBPACK_IMPORTED_MODULE_5__.normalizePhone10)(user?.phone ?? \"\");\n        if (!patientPhone) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"A valid 10-digit mobile number is required on your account to book. Re-register with a correct number or ask staff to update your profile.\"\n            }, {\n                status: 400\n            });\n        }\n        const appointment = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.$transaction(async (tx)=>{\n            const tokenNumber = await (0,_lib_appointment_token__WEBPACK_IMPORTED_MODULE_4__.generateUniqueAppointmentToken)(tx);\n            const created = await tx.appointment.create({\n                data: {\n                    patientId: session.user.id,\n                    doctorId,\n                    slotId,\n                    symptoms,\n                    status: \"CONFIRMED\",\n                    tokenNumber,\n                    patientPhone\n                },\n                include: {\n                    doctor: {\n                        include: {\n                            user: true\n                        }\n                    },\n                    slot: true\n                }\n            });\n            await tx.timeSlot.update({\n                where: {\n                    id: slotId\n                },\n                data: {\n                    isBooked: true\n                }\n            });\n            return created;\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(appointment);\n    } catch (err) {\n        console.error(err);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Booking failed\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hcHBvaW50bWVudHMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsb0NBQW9DO0FBQ007QUFDRTtBQUNKO0FBQ0g7QUFDbUM7QUFDMUI7QUFFdkMsZUFBZU07SUFDcEIsTUFBTUMsVUFBVSxNQUFNTiwyREFBZ0JBLENBQUNDLGtEQUFXQTtJQUNsRCxJQUFJLENBQUNLLFNBQVMsT0FBT1AscURBQVlBLENBQUNRLElBQUksQ0FBQztRQUFFQyxPQUFPO0lBQWUsR0FBRztRQUFFQyxRQUFRO0lBQUk7SUFFaEYsTUFBTUMsZUFBZSxNQUFNUiwrQ0FBTUEsQ0FBQ1MsV0FBVyxDQUFDQyxRQUFRLENBQUM7UUFDckRDLE9BQU87WUFBRUMsV0FBV1IsUUFBUVMsSUFBSSxDQUFDQyxFQUFFO1FBQUM7UUFDcENDLFNBQVM7WUFDUEMsUUFBUTtnQkFBRUQsU0FBUztvQkFBRUYsTUFBTTtnQkFBSztZQUFFO1lBQ2xDSSxNQUFNO1FBQ1I7UUFDQUMsU0FBUztZQUFFQyxXQUFXO1FBQU87SUFDL0I7SUFFQSxPQUFPdEIscURBQVlBLENBQUNRLElBQUksQ0FBQ0c7QUFDM0I7QUFFTyxlQUFlWSxLQUFLQyxHQUFZO0lBQ3JDLE1BQU1qQixVQUFVLE1BQU1OLDJEQUFnQkEsQ0FBQ0Msa0RBQVdBO0lBQ2xELElBQUksQ0FBQ0ssU0FBUyxPQUFPUCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1FBQUVDLE9BQU87SUFBZSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUVoRixJQUFJO1FBQ0YsTUFBTSxFQUFFZSxRQUFRLEVBQUVDLE1BQU0sRUFBRUMsUUFBUSxFQUFFLEdBQUcsTUFBTUgsSUFBSWhCLElBQUk7UUFFckQsTUFBTVksT0FBTyxNQUFNakIsK0NBQU1BLENBQUN5QixRQUFRLENBQUNDLFVBQVUsQ0FBQztZQUFFZixPQUFPO2dCQUFFRyxJQUFJUztZQUFPO1FBQUU7UUFDdEUsSUFBSSxDQUFDTixRQUFRQSxLQUFLVSxRQUFRLEVBQUU7WUFDMUIsT0FBTzlCLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7Z0JBQUVDLE9BQU87WUFBMkIsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ2hGO1FBRUEsTUFBTU0sT0FBTyxNQUFNYiwrQ0FBTUEsQ0FBQ2EsSUFBSSxDQUFDYSxVQUFVLENBQUM7WUFDeENmLE9BQU87Z0JBQUVHLElBQUlWLFFBQVFTLElBQUksQ0FBQ0MsRUFBRTtZQUFDO1lBQzdCYyxRQUFRO2dCQUFFQyxPQUFPO1lBQUs7UUFDeEI7UUFDQSxNQUFNQyxlQUFlNUIsNERBQWdCQSxDQUFDVyxNQUFNZ0IsU0FBUztRQUNyRCxJQUFJLENBQUNDLGNBQWM7WUFDakIsT0FBT2pDLHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO2dCQUNFQyxPQUNFO1lBQ0osR0FDQTtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTUUsY0FBYyxNQUFNVCwrQ0FBTUEsQ0FBQytCLFlBQVksQ0FBQyxPQUFPQztZQUNuRCxNQUFNQyxjQUFjLE1BQU1oQyxzRkFBOEJBLENBQUMrQjtZQUV6RCxNQUFNRSxVQUFVLE1BQU1GLEdBQUd2QixXQUFXLENBQUMwQixNQUFNLENBQUM7Z0JBQzFDQyxNQUFNO29CQUNKeEIsV0FBV1IsUUFBUVMsSUFBSSxDQUFDQyxFQUFFO29CQUMxQlE7b0JBQ0FDO29CQUNBQztvQkFDQWpCLFFBQVE7b0JBQ1IwQjtvQkFDQUg7Z0JBQ0Y7Z0JBQ0FmLFNBQVM7b0JBQ1BDLFFBQVE7d0JBQUVELFNBQVM7NEJBQUVGLE1BQU07d0JBQUs7b0JBQUU7b0JBQ2xDSSxNQUFNO2dCQUNSO1lBQ0Y7WUFFQSxNQUFNZSxHQUFHUCxRQUFRLENBQUNZLE1BQU0sQ0FBQztnQkFDdkIxQixPQUFPO29CQUFFRyxJQUFJUztnQkFBTztnQkFDcEJhLE1BQU07b0JBQUVULFVBQVU7Z0JBQUs7WUFDekI7WUFFQSxPQUFPTztRQUNUO1FBRUEsT0FBT3JDLHFEQUFZQSxDQUFDUSxJQUFJLENBQUNJO0lBQzNCLEVBQUUsT0FBTzZCLEtBQUs7UUFDWkMsUUFBUWpDLEtBQUssQ0FBQ2dDO1FBQ2QsT0FBT3pDLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFpQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUN0RTtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWVkYm9vay1haS8uL3NyYy9hcHAvYXBpL2FwcG9pbnRtZW50cy9yb3V0ZS50cz85NzU1Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9hcHAvYXBpL2FwcG9pbnRtZW50cy9yb3V0ZS50c1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJ1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoJ1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHsgZ2VuZXJhdGVVbmlxdWVBcHBvaW50bWVudFRva2VuIH0gZnJvbSAnQC9saWIvYXBwb2ludG1lbnQtdG9rZW4nXG5pbXBvcnQgeyBub3JtYWxpemVQaG9uZTEwIH0gZnJvbSAnQC9saWIvcGhvbmUnXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKVxuICBpZiAoIXNlc3Npb24pIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnVW5hdXRob3JpemVkJyB9LCB7IHN0YXR1czogNDAxIH0pXG5cbiAgY29uc3QgYXBwb2ludG1lbnRzID0gYXdhaXQgcHJpc21hLmFwcG9pbnRtZW50LmZpbmRNYW55KHtcbiAgICB3aGVyZTogeyBwYXRpZW50SWQ6IHNlc3Npb24udXNlci5pZCB9LFxuICAgIGluY2x1ZGU6IHtcbiAgICAgIGRvY3RvcjogeyBpbmNsdWRlOiB7IHVzZXI6IHRydWUgfSB9LFxuICAgICAgc2xvdDogdHJ1ZSxcbiAgICB9LFxuICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiAnZGVzYycgfSxcbiAgfSlcblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oYXBwb2ludG1lbnRzKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpXG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSlcblxuICB0cnkge1xuICAgIGNvbnN0IHsgZG9jdG9ySWQsIHNsb3RJZCwgc3ltcHRvbXMgfSA9IGF3YWl0IHJlcS5qc29uKClcblxuICAgIGNvbnN0IHNsb3QgPSBhd2FpdCBwcmlzbWEudGltZVNsb3QuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkOiBzbG90SWQgfSB9KVxuICAgIGlmICghc2xvdCB8fCBzbG90LmlzQm9va2VkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1Nsb3Qgbm8gbG9uZ2VyIGF2YWlsYWJsZScgfSwgeyBzdGF0dXM6IDQwOSB9KVxuICAgIH1cblxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBzZXNzaW9uLnVzZXIuaWQgfSxcbiAgICAgIHNlbGVjdDogeyBwaG9uZTogdHJ1ZSB9LFxuICAgIH0pXG4gICAgY29uc3QgcGF0aWVudFBob25lID0gbm9ybWFsaXplUGhvbmUxMCh1c2VyPy5waG9uZSA/PyAnJylcbiAgICBpZiAoIXBhdGllbnRQaG9uZSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7XG4gICAgICAgICAgZXJyb3I6XG4gICAgICAgICAgICAnQSB2YWxpZCAxMC1kaWdpdCBtb2JpbGUgbnVtYmVyIGlzIHJlcXVpcmVkIG9uIHlvdXIgYWNjb3VudCB0byBib29rLiBSZS1yZWdpc3RlciB3aXRoIGEgY29ycmVjdCBudW1iZXIgb3IgYXNrIHN0YWZmIHRvIHVwZGF0ZSB5b3VyIHByb2ZpbGUuJyxcbiAgICAgICAgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3QgYXBwb2ludG1lbnQgPSBhd2FpdCBwcmlzbWEuJHRyYW5zYWN0aW9uKGFzeW5jICh0eCkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5OdW1iZXIgPSBhd2FpdCBnZW5lcmF0ZVVuaXF1ZUFwcG9pbnRtZW50VG9rZW4odHgpXG5cbiAgICAgIGNvbnN0IGNyZWF0ZWQgPSBhd2FpdCB0eC5hcHBvaW50bWVudC5jcmVhdGUoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcGF0aWVudElkOiBzZXNzaW9uLnVzZXIuaWQsXG4gICAgICAgICAgZG9jdG9ySWQsXG4gICAgICAgICAgc2xvdElkLFxuICAgICAgICAgIHN5bXB0b21zLFxuICAgICAgICAgIHN0YXR1czogJ0NPTkZJUk1FRCcsXG4gICAgICAgICAgdG9rZW5OdW1iZXIsXG4gICAgICAgICAgcGF0aWVudFBob25lLFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgZG9jdG9yOiB7IGluY2x1ZGU6IHsgdXNlcjogdHJ1ZSB9IH0sXG4gICAgICAgICAgc2xvdDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHR4LnRpbWVTbG90LnVwZGF0ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkOiBzbG90SWQgfSxcbiAgICAgICAgZGF0YTogeyBpc0Jvb2tlZDogdHJ1ZSB9LFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGNyZWF0ZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGFwcG9pbnRtZW50KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0Jvb2tpbmcgZmFpbGVkJyB9LCB7IHN0YXR1czogNTAwIH0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJwcmlzbWEiLCJnZW5lcmF0ZVVuaXF1ZUFwcG9pbnRtZW50VG9rZW4iLCJub3JtYWxpemVQaG9uZTEwIiwiR0VUIiwic2Vzc2lvbiIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImFwcG9pbnRtZW50cyIsImFwcG9pbnRtZW50IiwiZmluZE1hbnkiLCJ3aGVyZSIsInBhdGllbnRJZCIsInVzZXIiLCJpZCIsImluY2x1ZGUiLCJkb2N0b3IiLCJzbG90Iiwib3JkZXJCeSIsImNyZWF0ZWRBdCIsIlBPU1QiLCJyZXEiLCJkb2N0b3JJZCIsInNsb3RJZCIsInN5bXB0b21zIiwidGltZVNsb3QiLCJmaW5kVW5pcXVlIiwiaXNCb29rZWQiLCJzZWxlY3QiLCJwaG9uZSIsInBhdGllbnRQaG9uZSIsIiR0cmFuc2FjdGlvbiIsInR4IiwidG9rZW5OdW1iZXIiLCJjcmVhdGVkIiwiY3JlYXRlIiwiZGF0YSIsInVwZGF0ZSIsImVyciIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/appointments/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/appointment-token.ts":
/*!**************************************!*\
  !*** ./src/lib/appointment-token.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generateUniqueAppointmentToken: () => (/* binding */ generateUniqueAppointmentToken)\n/* harmony export */ });\n/** Format: U + 4 digits (e.g. U0427). Unique within Appointment.tokenNumber. */ async function generateUniqueAppointmentToken(tx) {\n    for(let attempt = 0; attempt < 40; attempt++){\n        const digits = Math.floor(Math.random() * 10000).toString().padStart(4, \"0\");\n        const token = `U${digits}`;\n        const clash = await tx.appointment.findFirst({\n            where: {\n                tokenNumber: token\n            },\n            select: {\n                id: true\n            }\n        });\n        if (!clash) return token;\n    }\n    throw new Error(\"Unable to generate a unique appointment token\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2FwcG9pbnRtZW50LXRva2VuLnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFFQSw4RUFBOEUsR0FDdkUsZUFBZUEsK0JBQ3BCQyxFQUE0QjtJQUU1QixJQUFLLElBQUlDLFVBQVUsR0FBR0EsVUFBVSxJQUFJQSxVQUFXO1FBQzdDLE1BQU1DLFNBQVNDLEtBQUtDLEtBQUssQ0FBQ0QsS0FBS0UsTUFBTSxLQUFLLE9BQ3ZDQyxRQUFRLEdBQ1JDLFFBQVEsQ0FBQyxHQUFHO1FBQ2YsTUFBTUMsUUFBUSxDQUFDLENBQUMsRUFBRU4sT0FBTyxDQUFDO1FBQzFCLE1BQU1PLFFBQVEsTUFBTVQsR0FBR1UsV0FBVyxDQUFDQyxTQUFTLENBQUM7WUFDM0NDLE9BQU87Z0JBQUVDLGFBQWFMO1lBQU07WUFDNUJNLFFBQVE7Z0JBQUVDLElBQUk7WUFBSztRQUNyQjtRQUNBLElBQUksQ0FBQ04sT0FBTyxPQUFPRDtJQUNyQjtJQUNBLE1BQU0sSUFBSVEsTUFBTTtBQUNsQiIsInNvdXJjZXMiOlsid2VicGFjazovL21lZGJvb2stYWkvLi9zcmMvbGliL2FwcG9pbnRtZW50LXRva2VuLnRzPzhkODciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQcmlzbWEgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuXHJcbi8qKiBGb3JtYXQ6IFUgKyA0IGRpZ2l0cyAoZS5nLiBVMDQyNykuIFVuaXF1ZSB3aXRoaW4gQXBwb2ludG1lbnQudG9rZW5OdW1iZXIuICovXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVVuaXF1ZUFwcG9pbnRtZW50VG9rZW4oXHJcbiAgdHg6IFByaXNtYS5UcmFuc2FjdGlvbkNsaWVudFxyXG4pOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgNDA7IGF0dGVtcHQrKykge1xyXG4gICAgY29uc3QgZGlnaXRzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDApXHJcbiAgICAgIC50b1N0cmluZygpXHJcbiAgICAgIC5wYWRTdGFydCg0LCAnMCcpXHJcbiAgICBjb25zdCB0b2tlbiA9IGBVJHtkaWdpdHN9YFxyXG4gICAgY29uc3QgY2xhc2ggPSBhd2FpdCB0eC5hcHBvaW50bWVudC5maW5kRmlyc3Qoe1xyXG4gICAgICB3aGVyZTogeyB0b2tlbk51bWJlcjogdG9rZW4gfSxcclxuICAgICAgc2VsZWN0OiB7IGlkOiB0cnVlIH0sXHJcbiAgICB9KVxyXG4gICAgaWYgKCFjbGFzaCkgcmV0dXJuIHRva2VuXHJcbiAgfVxyXG4gIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGdlbmVyYXRlIGEgdW5pcXVlIGFwcG9pbnRtZW50IHRva2VuJylcclxufVxyXG4iXSwibmFtZXMiOlsiZ2VuZXJhdGVVbmlxdWVBcHBvaW50bWVudFRva2VuIiwidHgiLCJhdHRlbXB0IiwiZGlnaXRzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwidG9TdHJpbmciLCJwYWRTdGFydCIsInRva2VuIiwiY2xhc2giLCJhcHBvaW50bWVudCIsImZpbmRGaXJzdCIsIndoZXJlIiwidG9rZW5OdW1iZXIiLCJzZWxlY3QiLCJpZCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/appointment-token.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth-secret.ts":
/*!********************************!*\
  !*** ./src/lib/auth-secret.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAuthSecret: () => (/* binding */ getAuthSecret)\n/* harmony export */ });\n/**\r\n * Single source of truth for NextAuth JWT signing and middleware `getToken`.\r\n * Edge middleware often does not see `NODE_ENV === 'development'`, so we must\r\n * not rely on it for the fallback — otherwise tokens verify in Node but fail in middleware.\r\n */ const FALLBACK_SECRET = \"medbook-local-dev-only-secret-change-me-32chars\";\nfunction getAuthSecret() {\n    return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || FALLBACK_SECRET;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgtc2VjcmV0LnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztDQUlDLEdBQ0QsTUFBTUEsa0JBQWtCO0FBRWpCLFNBQVNDO0lBQ2QsT0FDRUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlLElBQzNCRixRQUFRQyxHQUFHLENBQUNFLFdBQVcsSUFDdkJMO0FBRUoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZWRib29rLWFpLy4vc3JjL2xpYi9hdXRoLXNlY3JldC50cz9kY2Q5Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciBOZXh0QXV0aCBKV1Qgc2lnbmluZyBhbmQgbWlkZGxld2FyZSBgZ2V0VG9rZW5gLlxyXG4gKiBFZGdlIG1pZGRsZXdhcmUgb2Z0ZW4gZG9lcyBub3Qgc2VlIGBOT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J2AsIHNvIHdlIG11c3RcclxuICogbm90IHJlbHkgb24gaXQgZm9yIHRoZSBmYWxsYmFjayDigJQgb3RoZXJ3aXNlIHRva2VucyB2ZXJpZnkgaW4gTm9kZSBidXQgZmFpbCBpbiBtaWRkbGV3YXJlLlxyXG4gKi9cclxuY29uc3QgRkFMTEJBQ0tfU0VDUkVUID0gJ21lZGJvb2stbG9jYWwtZGV2LW9ubHktc2VjcmV0LWNoYW5nZS1tZS0zMmNoYXJzJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF1dGhTZWNyZXQoKTogc3RyaW5nIHtcclxuICByZXR1cm4gKFxyXG4gICAgcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVUIHx8XHJcbiAgICBwcm9jZXNzLmVudi5BVVRIX1NFQ1JFVCB8fFxyXG4gICAgRkFMTEJBQ0tfU0VDUkVUXHJcbiAgKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJGQUxMQkFDS19TRUNSRVQiLCJnZXRBdXRoU2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCIsIkFVVEhfU0VDUkVUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth-secret.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _auth_secret__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth-secret */ \"(rsc)/./src/lib/auth-secret.ts\");\n// src/lib/auth.ts\n\n\n\n\nfunction normalizeEmail(email) {\n    return email.trim().toLowerCase();\n}\nconst authOptions = {\n    secret: (0,_auth_secret__WEBPACK_IMPORTED_MODULE_3__.getAuthSecret)(),\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                try {\n                    if (!credentials?.email || !credentials?.password) return null;\n                    const email = normalizeEmail(credentials.email);\n                    if (!email) return null;\n                    const user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                        where: {\n                            email\n                        }\n                    });\n                    if (!user) return null;\n                    const valid = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(credentials.password, user.password);\n                    if (!valid) return null;\n                    return {\n                        id: user.id,\n                        name: user.name,\n                        email: user.email,\n                        role: String(user.role)\n                    };\n                } catch (e) {\n                    console.error(\"[next-auth authorize]\", e);\n                    return null;\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.role = String(user.role ?? \"\");\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user && token) {\n                if (token.id) session.user.id = token.id;\n                if (token.role != null) session.user.role = token.role;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsa0JBQWtCO0FBRStDO0FBQ3BDO0FBQ0k7QUFDWTtBQUU3QyxTQUFTSSxlQUFlQyxLQUFhO0lBQ25DLE9BQU9BLE1BQU1DLElBQUksR0FBR0MsV0FBVztBQUNqQztBQUVPLE1BQU1DLGNBQStCO0lBQzFDQyxRQUFRTiwyREFBYUE7SUFDckJPLFdBQVc7UUFDVFYsMkVBQW1CQSxDQUFDO1lBQ2xCVyxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hQLE9BQU87b0JBQUVRLE9BQU87b0JBQVNDLE1BQU07Z0JBQVE7Z0JBQ3ZDQyxVQUFVO29CQUFFRixPQUFPO29CQUFZQyxNQUFNO2dCQUFXO1lBQ2xEO1lBQ0EsTUFBTUUsV0FBVUosV0FBVztnQkFDekIsSUFBSTtvQkFDRixJQUFJLENBQUNBLGFBQWFQLFNBQVMsQ0FBQ08sYUFBYUcsVUFBVSxPQUFPO29CQUUxRCxNQUFNVixRQUFRRCxlQUFlUSxZQUFZUCxLQUFLO29CQUM5QyxJQUFJLENBQUNBLE9BQU8sT0FBTztvQkFFbkIsTUFBTVksT0FBTyxNQUFNZiwyQ0FBTUEsQ0FBQ2UsSUFBSSxDQUFDQyxVQUFVLENBQUM7d0JBQ3hDQyxPQUFPOzRCQUFFZDt3QkFBTTtvQkFDakI7b0JBRUEsSUFBSSxDQUFDWSxNQUFNLE9BQU87b0JBRWxCLE1BQU1HLFFBQVEsTUFBTW5CLHVEQUFjLENBQUNXLFlBQVlHLFFBQVEsRUFBRUUsS0FBS0YsUUFBUTtvQkFDdEUsSUFBSSxDQUFDSyxPQUFPLE9BQU87b0JBRW5CLE9BQU87d0JBQ0xFLElBQUlMLEtBQUtLLEVBQUU7d0JBQ1hYLE1BQU1NLEtBQUtOLElBQUk7d0JBQ2ZOLE9BQU9ZLEtBQUtaLEtBQUs7d0JBQ2pCa0IsTUFBTUMsT0FBT1AsS0FBS00sSUFBSTtvQkFDeEI7Z0JBQ0YsRUFBRSxPQUFPRSxHQUFHO29CQUNWQyxRQUFRQyxLQUFLLENBQUMseUJBQXlCRjtvQkFDdkMsT0FBTztnQkFDVDtZQUNGO1FBQ0Y7S0FDRDtJQUNERyxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUViLElBQUksRUFBRTtZQUN2QixJQUFJQSxNQUFNO2dCQUNSYSxNQUFNUixFQUFFLEdBQUdMLEtBQUtLLEVBQUU7Z0JBQ2xCUSxNQUFNUCxJQUFJLEdBQUdDLE9BQU8sS0FBNEJELElBQUksSUFBSTtZQUMxRDtZQUNBLE9BQU9PO1FBQ1Q7UUFDQSxNQUFNQyxTQUFRLEVBQUVBLE9BQU8sRUFBRUQsS0FBSyxFQUFFO1lBQzlCLElBQUlDLFFBQVFkLElBQUksSUFBSWEsT0FBTztnQkFDekIsSUFBSUEsTUFBTVIsRUFBRSxFQUFFUyxRQUFRZCxJQUFJLENBQUNLLEVBQUUsR0FBR1EsTUFBTVIsRUFBRTtnQkFDeEMsSUFBSVEsTUFBTVAsSUFBSSxJQUFJLE1BQU1RLFFBQVFkLElBQUksQ0FBQ00sSUFBSSxHQUFHTyxNQUFNUCxJQUFJO1lBQ3hEO1lBQ0EsT0FBT1E7UUFDVDtJQUNGO0lBQ0FDLE9BQU87UUFDTEMsUUFBUTtJQUNWO0lBQ0FGLFNBQVM7UUFBRUcsVUFBVTtRQUFPQyxRQUFRLEtBQUssS0FBSyxLQUFLO0lBQUc7QUFDeEQsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL21lZGJvb2stYWkvLi9zcmMvbGliL2F1dGgudHM/NjY5MiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvbGliL2F1dGgudHNcbmltcG9ydCB0eXBlIHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJ1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFscydcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICcuL3ByaXNtYSdcbmltcG9ydCB7IGdldEF1dGhTZWNyZXQgfSBmcm9tICcuL2F1dGgtc2VjcmV0J1xuXG5mdW5jdGlvbiBub3JtYWxpemVFbWFpbChlbWFpbDogc3RyaW5nKSB7XG4gIHJldHVybiBlbWFpbC50cmltKCkudG9Mb3dlckNhc2UoKVxufVxuXG5leHBvcnQgY29uc3QgYXV0aE9wdGlvbnM6IE5leHRBdXRoT3B0aW9ucyA9IHtcbiAgc2VjcmV0OiBnZXRBdXRoU2VjcmV0KCksXG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogJ2NyZWRlbnRpYWxzJyxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiAnRW1haWwnLCB0eXBlOiAnZW1haWwnIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzPy5wYXNzd29yZCkgcmV0dXJuIG51bGxcblxuICAgICAgICAgIGNvbnN0IGVtYWlsID0gbm9ybWFsaXplRW1haWwoY3JlZGVudGlhbHMuZW1haWwpXG4gICAgICAgICAgaWYgKCFlbWFpbCkgcmV0dXJuIG51bGxcblxuICAgICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgICAgICAgIHdoZXJlOiB7IGVtYWlsIH0sXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmICghdXNlcikgcmV0dXJuIG51bGxcblxuICAgICAgICAgIGNvbnN0IHZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpXG4gICAgICAgICAgaWYgKCF2YWxpZCkgcmV0dXJuIG51bGxcblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgICAgcm9sZTogU3RyaW5nKHVzZXIucm9sZSksXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignW25leHQtYXV0aCBhdXRob3JpemVdJywgZSlcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB0b2tlbi5pZCA9IHVzZXIuaWRcbiAgICAgICAgdG9rZW4ucm9sZSA9IFN0cmluZygodXNlciBhcyB7IHJvbGU/OiBzdHJpbmcgfSkucm9sZSA/PyAnJylcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlblxuICAgIH0sXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgIGlmIChzZXNzaW9uLnVzZXIgJiYgdG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuLmlkKSBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5pZCBhcyBzdHJpbmdcbiAgICAgICAgaWYgKHRva2VuLnJvbGUgIT0gbnVsbCkgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlIGFzIHN0cmluZ1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlc3Npb25cbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9sb2dpbicsXG4gIH0sXG4gIHNlc3Npb246IHsgc3RyYXRlZ3k6ICdqd3QnLCBtYXhBZ2U6IDMwICogMjQgKiA2MCAqIDYwIH0sXG59XG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsImJjcnlwdCIsInByaXNtYSIsImdldEF1dGhTZWNyZXQiLCJub3JtYWxpemVFbWFpbCIsImVtYWlsIiwidHJpbSIsInRvTG93ZXJDYXNlIiwiYXV0aE9wdGlvbnMiLCJzZWNyZXQiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJ2YWxpZCIsImNvbXBhcmUiLCJpZCIsInJvbGUiLCJTdHJpbmciLCJlIiwiY29uc29sZSIsImVycm9yIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJzZXNzaW9uIiwicGFnZXMiLCJzaWduSW4iLCJzdHJhdGVneSIsIm1heEFnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/phone.ts":
/*!**************************!*\
  !*** ./src/lib/phone.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   isValidPhone10: () => (/* binding */ isValidPhone10),\n/* harmony export */   normalizePhone10: () => (/* binding */ normalizePhone10)\n/* harmony export */ });\n/** Strip to a 10-digit Indian mobile (handles +91, spaces, leading 0). */ function normalizePhone10(raw) {\n    const d = String(raw).replace(/\\D/g, \"\");\n    if (d.length === 10) return d;\n    if (d.length === 12 && d.startsWith(\"91\")) return d.slice(-10);\n    if (d.length === 11 && d.startsWith(\"0\")) return d.slice(1);\n    return null;\n}\nfunction isValidPhone10(raw) {\n    return normalizePhone10(raw) !== null;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3Bob25lLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0VBQXdFLEdBQ2pFLFNBQVNBLGlCQUFpQkMsR0FBVztJQUMxQyxNQUFNQyxJQUFJQyxPQUFPRixLQUFLRyxPQUFPLENBQUMsT0FBTztJQUNyQyxJQUFJRixFQUFFRyxNQUFNLEtBQUssSUFBSSxPQUFPSDtJQUM1QixJQUFJQSxFQUFFRyxNQUFNLEtBQUssTUFBTUgsRUFBRUksVUFBVSxDQUFDLE9BQU8sT0FBT0osRUFBRUssS0FBSyxDQUFDLENBQUM7SUFDM0QsSUFBSUwsRUFBRUcsTUFBTSxLQUFLLE1BQU1ILEVBQUVJLFVBQVUsQ0FBQyxNQUFNLE9BQU9KLEVBQUVLLEtBQUssQ0FBQztJQUN6RCxPQUFPO0FBQ1Q7QUFFTyxTQUFTQyxlQUFlUCxHQUFXO0lBQ3hDLE9BQU9ELGlCQUFpQkMsU0FBUztBQUNuQyIsInNvdXJjZXMiOlsid2VicGFjazovL21lZGJvb2stYWkvLi9zcmMvbGliL3Bob25lLnRzP2FiNzUiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIFN0cmlwIHRvIGEgMTAtZGlnaXQgSW5kaWFuIG1vYmlsZSAoaGFuZGxlcyArOTEsIHNwYWNlcywgbGVhZGluZyAwKS4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVBob25lMTAocmF3OiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcclxuICBjb25zdCBkID0gU3RyaW5nKHJhdykucmVwbGFjZSgvXFxEL2csICcnKVxyXG4gIGlmIChkLmxlbmd0aCA9PT0gMTApIHJldHVybiBkXHJcbiAgaWYgKGQubGVuZ3RoID09PSAxMiAmJiBkLnN0YXJ0c1dpdGgoJzkxJykpIHJldHVybiBkLnNsaWNlKC0xMClcclxuICBpZiAoZC5sZW5ndGggPT09IDExICYmIGQuc3RhcnRzV2l0aCgnMCcpKSByZXR1cm4gZC5zbGljZSgxKVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkUGhvbmUxMChyYXc6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBub3JtYWxpemVQaG9uZTEwKHJhdykgIT09IG51bGxcclxufVxyXG4iXSwibmFtZXMiOlsibm9ybWFsaXplUGhvbmUxMCIsInJhdyIsImQiLCJTdHJpbmciLCJyZXBsYWNlIiwibGVuZ3RoIiwic3RhcnRzV2l0aCIsInNsaWNlIiwiaXNWYWxpZFBob25lMTAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/phone.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// src/lib/prisma.ts — single client per server instance (important on Vercel / serverless)\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nglobalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwyRkFBMkY7QUFDOUM7QUFFN0MsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUNYRixnQkFBZ0JFLE1BQU0sSUFDdEIsSUFBSUgsd0RBQVlBLENBQUM7SUFDZkksS0FBS0MsS0FBeUIsR0FBZ0I7UUFBQztRQUFTO1FBQVM7S0FBTyxHQUFHLENBQVM7QUFDdEYsR0FBRTtBQUVKSixnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZWRib29rLWFpLy4vc3JjL2xpYi9wcmlzbWEudHM/MDFkNyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvbGliL3ByaXNtYS50cyDigJQgc2luZ2xlIGNsaWVudCBwZXIgc2VydmVyIGluc3RhbmNlIChpbXBvcnRhbnQgb24gVmVyY2VsIC8gc2VydmVybGVzcylcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZCB9XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBbJ3F1ZXJ5JywgJ2Vycm9yJywgJ3dhcm4nXSA6IFsnZXJyb3InXSxcbiAgfSlcblxuZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fappointments%2Froute&page=%2Fapi%2Fappointments%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fappointments%2Froute.ts&appDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Clenovo%5CDownloads%5Cmedbook-ai%5Cmedbook&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();