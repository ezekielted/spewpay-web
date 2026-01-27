"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export default function AppearanceSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const themeOptions = [
        { id: "light", name: "Light", icon: Sun, color: "text-orange-500", bg: "bg-orange-500/10" },
        { id: "dark", name: "Dark", icon: Moon, color: "text-indigo-400", bg: "bg-indigo-400/10" },
        { id: "system", name: "System", icon: Monitor, color: "text-slate-500", bg: "bg-slate-500/10" },
    ];

    return (
        <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                    Appearance
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    Customize how Spewpay looks on your device
                </p>
            </div>

            <div className="grid gap-6">
                <div className="rounded-3xl bg-card border border-border p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold">Color Theme</h3>
                        <p className="text-sm text-slate-500 font-medium">Choose between light, dark, or system preference</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themeOptions.map((option) => {
                            const isActive = theme === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setTheme(option.id)}
                                    className={`relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all group ${
                                        isActive 
                                            ? "border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10" 
                                            : "border-border bg-background hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    }`}
                                >
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${option.bg} ${option.color}`}>
                                        <option.icon className="h-6 w-6" />
                                    </div>
                                    <span className={`font-bold ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                                        {option.name}
                                    </span>

                                    {isActive && (
                                        <div className="absolute top-3 right-3 h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-3xl bg-card border border-border p-8">
                     <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <h3 className="text-lg font-bold">Accent Color</h3>
                            <p className="text-sm text-slate-500 font-medium">The primary color used for highlights and buttons</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm" />
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Emerald (Default)</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
