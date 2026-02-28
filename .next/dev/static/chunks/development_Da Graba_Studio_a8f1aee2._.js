(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/development/Da Graba_Studio/app/explorer/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Explorer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/store/useDAWStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
// Dummy data from user's request
const LIVE_RADIO = [
    {
        title: 'Chill Lounge',
        handle: '@mercury',
        listeners: '4.4K',
        color: 'from-blue-500/20 to-purple-500/20'
    },
    {
        title: 'A u r a P h o n k',
        handle: '@yumi',
        listeners: '5.2K',
        color: 'from-fuchsia-500/20 to-pink-500/20'
    },
    {
        title: 'Tokyo Lofi',
        handle: '@yumi',
        listeners: '277',
        color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
        title: 'Heavenly Beats',
        handle: '@mercury',
        listeners: '4.1K',
        color: 'from-cyan-500/20 to-blue-500/20'
    },
    {
        title: 'Hip Hop Central',
        handle: '@reedbeatz_',
        listeners: '4.5K',
        color: 'from-red-500/20 to-orange-500/20'
    },
    {
        title: 'Mythic Realms',
        handle: '@graceholloway',
        listeners: '394',
        color: 'from-indigo-500/20 to-violet-500/20'
    },
    {
        title: 'Afro Sunset Lounge',
        handle: '@ohayes',
        listeners: '4.6K',
        color: 'from-orange-500/20 to-yellow-500/20'
    },
    {
        title: 'Techno Mainstage',
        handle: '@jordanmiles',
        listeners: '162',
        color: 'from-rose-500/20 to-red-500/20'
    },
    {
        title: 'Miami 1985',
        handle: '@musicgpt',
        listeners: '5.4K',
        color: 'from-pink-500/20 to-purple-500/20'
    },
    {
        title: 'Elegant Jazz',
        handle: '@musicgpt',
        listeners: '9',
        color: 'from-amber-500/20 to-yellow-500/20'
    }
];
const TRENDING_CATEGORIES = [
    {
        title: 'Top 100',
        likes: '97K'
    },
    {
        title: 'Hip Hop',
        likes: '29K'
    },
    {
        title: 'Afro House',
        likes: '36K'
    },
    {
        title: 'Chillout',
        likes: '31K'
    },
    {
        title: 'Popular Remixes',
        likes: '37K'
    },
    {
        title: 'Eurovision Reimagined',
        likes: '23K'
    },
    {
        title: 'K-pop',
        likes: '38K'
    },
    {
        title: 'Dark R&B',
        likes: '41K'
    },
    {
        title: 'Pop',
        likes: '25K'
    }
];
const BEATS_CATEGORIES = [
    {
        title: 'Type Beats',
        likes: '92K'
    },
    {
        title: 'Heavenly Beats',
        likes: '85K'
    },
    {
        title: 'LoFi beats',
        likes: '38K'
    },
    {
        title: 'House Essentials',
        likes: '48K'
    },
    {
        title: 'Aura Phonk',
        likes: '36K'
    },
    {
        title: 'Melodic Techno',
        likes: '30K'
    },
    {
        title: 'Angelcore',
        likes: '10K'
    },
    {
        title: 'Slap House Beats',
        likes: '28K'
    }
];
const FILM_TV_CATEGORIES = [
    {
        title: 'Cinematic',
        likes: '31K'
    },
    {
        title: 'Action',
        likes: '19K'
    },
    {
        title: 'Epic Realms - Myth & Fantasy',
        likes: '11K'
    },
    {
        title: 'Dark Fantasy - Hollow Realms',
        likes: '8K'
    },
    {
        title: 'Medieval Taverns',
        likes: '7K'
    },
    {
        title: 'Horror Themes',
        likes: '48K'
    },
    {
        title: 'Classical',
        likes: '48K'
    }
];
const SOUND_EFFECTS_CATEGORIES = [
    {
        title: 'Film Sound FX',
        likes: '21K'
    },
    {
        title: 'Ambience',
        likes: '9K'
    },
    {
        title: 'Notification Sounds',
        likes: '16K'
    },
    {
        title: 'E-commerce SFX',
        likes: '6K'
    },
    {
        title: 'Nature Ambience',
        likes: '14K'
    },
    {
        title: 'Casino - SFX',
        likes: '17K'
    },
    {
        title: 'Warzone SFX',
        likes: '18K'
    }
];
const HorizontalScrollContainer = ({ title, subtitle, items, renderItem })=>{
    _s();
    const scrollRef = __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const scroll = (direction)=>{
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mb-12 relative w-full group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end justify-between mb-4 px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold tracking-tight text-white flex items-center gap-2",
                                children: [
                                    title,
                                    title === 'Trending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-orange-500",
                                        children: "🚀"
                                    }, void 0, false, {
                                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 50
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 78,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[#888] font-medium mt-1 uppercase tracking-widest",
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 82,
                                columnNumber: 34
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 77,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>scroll('left'),
                                className: "p-2 bg-[#1A1A1A] hover:bg-[#333] rounded-full text-white transition-all shadow-xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 86,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 85,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>scroll('right'),
                                className: "p-2 bg-[#1A1A1A] hover:bg-[#333] rounded-full text-white transition-all shadow-xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 88,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 84,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                lineNumber: 76,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollRef,
                className: "flex overflow-x-auto gap-4 pb-4 px-8 snap-x snap-mandatory custom-scrollbar hidden-scrollbar",
                style: {
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                },
                children: items.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "snap-start shrink-0",
                        children: renderItem(item, i)
                    }, i, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 100,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                lineNumber: 94,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
        lineNumber: 75,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HorizontalScrollContainer, "rUl6RJdP9XfufN21BrtKqIOri0o=");
_c = HorizontalScrollContainer;
function Explorer() {
    _s1();
    const { isPlaying, setIsPlaying } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"])();
    const [activeRadio, setActiveRadio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handlePlayRadio = (title)=>{
        if (activeRadio === title) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveRadio(title);
            setIsPlaying(true);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full bg-[#050505] flex flex-col overflow-y-auto overflow-x-hidden relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-none p-8 pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-6 text-sm font-bold text-[#888]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#333]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 14,
                                    className: "text-green-500"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 25
                                }, this),
                                " Unlimited Streaming"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                            lineNumber: 129,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2 text-white/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 14,
                                    className: "text-green-500"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 133,
                                    columnNumber: 25
                                }, this),
                                " Free Downloads"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                            lineNumber: 132,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2 text-white/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 14,
                                    className: "text-green-500"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 25
                                }, this),
                                " No Copyright Issues"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2 text-white/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 14,
                                    className: "text-green-500"
                                }, void 0, false, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, this),
                                " Royalty Free"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                            lineNumber: 138,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                lineNumber: 127,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 pb-32",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HorizontalScrollContainer, {
                        title: "Listen with MusicGPT Radio",
                        items: LIVE_RADIO,
                        renderItem: (radio)=>{
                            const isCurrentlyPlaying = activeRadio === radio.title && isPlaying;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "group w-[200px] flex flex-col items-center gap-3 cursor-pointer",
                                onClick: ()=>handlePlayRadio(radio.title),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-32 h-32 rounded-full bg-gradient-to-br ${radio.color} border-2 relative flex items-center justify-center transition-all duration-500 shadow-2xl ${activeRadio === radio.title ? 'border-orange-500 shadow-orange-500/20' : 'border-[#222] group-hover:border-[#444]'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute top-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest bg-red-600 text-white ${activeRadio === radio.title ? 'animate-pulse' : ''}`,
                                                children: "LIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 154,
                                                columnNumber: 37
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300",
                                                children: isCurrentlyPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                    size: 20,
                                                    fill: "black"
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 63
                                                }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                    size: 20,
                                                    fill: "black",
                                                    className: "ml-1"
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 98
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 157,
                                                columnNumber: 37
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                        lineNumber: 153,
                                        columnNumber: 33
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-white font-bold text-sm tracking-wide truncate w-[180px]",
                                                children: radio.title
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 162,
                                                columnNumber: 37
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-center gap-2 text-xs text-[#888] mt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: radio.handle
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 41
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1 h-1 rounded-full bg-[#444]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 41
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            radio.listeners,
                                                            " Listening"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 41
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 37
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                        lineNumber: 161,
                                        columnNumber: 33
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 152,
                                columnNumber: 29
                            }, void 0);
                        }
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 146,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HorizontalScrollContainer, {
                        title: "Trending",
                        subtitle: "Updated today",
                        items: TRENDING_CATEGORIES,
                        renderItem: (cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "aspect-square bg-[#1A1A1A] relative",
                                    style: {
                                        backgroundImage: `url(https://picsum.photos/seed/trend${i}/300/300)`,
                                        backgroundSize: 'cover'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 182,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 18,
                                                fill: "white",
                                                className: "ml-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 184,
                                                columnNumber: 37
                                            }, void 0)
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 183,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md",
                                                    children: cat.title
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 37
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-orange-400 font-bold drop-shadow-md",
                                                    children: [
                                                        cat.likes,
                                                        " Likes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 37
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 186,
                                            columnNumber: 33
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 181,
                                    columnNumber: 29
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 180,
                                columnNumber: 25
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 175,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HorizontalScrollContainer, {
                        title: "Beats",
                        subtitle: "Updated today",
                        items: BEATS_CATEGORIES,
                        renderItem: (cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "aspect-square bg-[#1A1A1A] relative",
                                    style: {
                                        backgroundImage: `url(https://picsum.photos/seed/beats${i}/300/300)`,
                                        backgroundSize: 'cover'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 18,
                                                fill: "white",
                                                className: "ml-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 205,
                                                columnNumber: 37
                                            }, void 0)
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 204,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md",
                                                    children: cat.title
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 37
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-orange-400 font-bold drop-shadow-md",
                                                    children: [
                                                        cat.likes,
                                                        " Likes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 37
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 33
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 29
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 201,
                                columnNumber: 25
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 196,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HorizontalScrollContainer, {
                        title: "Film, Game & TV",
                        subtitle: "Updated today",
                        items: FILM_TV_CATEGORIES,
                        renderItem: (cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "aspect-square bg-[#1A1A1A] relative",
                                    style: {
                                        backgroundImage: `url(https://picsum.photos/seed/film${i}/300/300)`,
                                        backgroundSize: 'cover'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 224,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 18,
                                                fill: "white",
                                                className: "ml-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 37
                                            }, void 0)
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md",
                                                    children: cat.title
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 37
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-orange-400 font-bold drop-shadow-md",
                                                    children: [
                                                        cat.likes,
                                                        " Likes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 37
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 228,
                                            columnNumber: 33
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 223,
                                    columnNumber: 29
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 222,
                                columnNumber: 25
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 217,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HorizontalScrollContainer, {
                        title: "Sound Effects",
                        subtitle: "Updated today",
                        items: SOUND_EFFECTS_CATEGORIES,
                        renderItem: (cat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-[180px] group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-orange-500/50 transition-all duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "aspect-square bg-[#1A1A1A] relative",
                                    style: {
                                        backgroundImage: `url(https://picsum.photos/seed/sfx${i}/300/300)`,
                                        backgroundSize: 'cover'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 245,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "absolute bottom-4 right-4 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20 hover:bg-orange-500 hover:scale-110",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 18,
                                                fill: "white",
                                                className: "ml-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                lineNumber: 247,
                                                columnNumber: 37
                                            }, void 0)
                                        }, void 0, false, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 246,
                                            columnNumber: 33
                                        }, void 0),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-4 left-4 z-10 w-full pr-16 bg-gradient-to-r from-black/80 to-transparent p-1 rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-white font-black text-xs uppercase tracking-wider truncate drop-shadow-md",
                                                    children: cat.title
                                                }, void 0, false, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 37
                                                }, void 0),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-orange-400 font-bold drop-shadow-md",
                                                    children: [
                                                        cat.likes,
                                                        " Likes"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 37
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                            lineNumber: 249,
                                            columnNumber: 33
                                        }, void 0)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 29
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                                lineNumber: 243,
                                columnNumber: 25
                            }, void 0)
                    }, void 0, false, {
                        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                        lineNumber: 238,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
                lineNumber: 144,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/development/Da Graba_Studio/app/explorer/page.tsx",
        lineNumber: 124,
        columnNumber: 9
    }, this);
}
_s1(Explorer, "Kdpn+OfKGOJ4NEFbHgEeEC2zrBs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$store$2f$useDAWStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDAWStore"]
    ];
});
_c1 = Explorer;
var _c, _c1;
__turbopack_context__.k.register(_c, "HorizontalScrollContainer");
__turbopack_context__.k.register(_c1, "Explorer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronLeft
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m15 18-6-6 6-6",
            key: "1wnfg3"
        }
    ]
];
const ChevronLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-left", __iconNode);
;
 //# sourceMappingURL=chevron-left.js.map
}),
"[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript)");
}),
"[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronRight
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m9 18 6-6-6-6",
            key: "mthhwq"
        }
    ]
];
const ChevronRight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-right", __iconNode);
;
 //# sourceMappingURL=chevron-right.js.map
}),
"[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronRight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript)");
}),
"[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Check
]);
/**
 * @license lucide-react v0.575.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$development$2f$Da__Graba_Studio$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/development/Da Graba_Studio/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=development_Da%20Graba_Studio_a8f1aee2._.js.map