'use client';

import React, { useState } from 'react';
import { Settings, Globe, Power, HardDrive, AlertTriangle } from 'lucide-react';

export function SystemConfig() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('us-east-1');
    const [apiKey, setApiKey] = useState('sk_live_v1_...hidden...');

    return (
        <section id="config" className="bg-[#0A0A0C]/80 backdrop-blur-md border border-[#333] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6 mt-8 mb-20">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-md">
                        <Settings size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">SYSTEM CONFIG</h2>
                        <p className="text-xs text-[#888]">Master Toggles y Variables de Entorno</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Toggles & Region */}
                <div className="flex flex-col gap-6">
                    {/* Maintenance Mode */}
                    <div className="flex items-center justify-between bg-[#111] border border-[#333] p-4 rounded-md shadow-inner">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className={maintenanceMode ? "text-red-500 animate-pulse" : "text-[#555]"} />
                            <div className="flex flex-col">
                                <span className={`text-sm font-bold tracking-widest uppercase ${maintenanceMode ? "text-red-500" : "text-[#E0E0E0]"}`}>
                                    Modo Mantenimiento
                                </span>
                                <span className="text-[10px] text-[#888]">Cierra acceso a todos los usuarios excepto Admin.</span>
                            </div>
                        </div>
                        {/* Custom Toggle Switch */}
                        <div
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${maintenanceMode ? 'bg-red-600' : 'bg-[#333]'}`}
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    {/* Server Region Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                            <Globe size={14} /> REGIÓN DE ANTIGRAVITY
                        </label>
                        <select
                            className="bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-[#E0E0E0] outline-none focus:border-[#00F0FF] transition-colors"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <option value="us-east-1">US-East (N. Virginia)</option>
                            <option value="eu-central-1">EU-Central (Frankfurt)</option>
                            <option value="sa-east-1">SA-East (São Paulo)</option>
                        </select>
                    </div>
                </div>

                {/* API Keys and Quick Actions */}
                <div className="flex flex-col gap-6">
                    {/* Deep Logic / Modal Config */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                            <HardDrive size={14} /> KIE API KEY (Master Override)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="flex-1 bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-white font-mono outline-none focus:border-[#00F0FF] transition-colors"
                            />
                            <button className="bg-[#222] hover:bg-[#333] text-white border border-[#444] px-4 py-2 rounded text-xs font-bold tracking-widest transition-colors">
                                SAVE
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#1A1A1C] border border-[#FF6B00]/30 rounded-md p-4 flex flex-col items-center justify-center gap-2 mt-auto">
                        <Power size={24} className="text-[#FF6B00]" />
                        <span className="text-xs font-bold text-[#FFA07A] uppercase tracking-widest text-center">
                            Reiniciar Servicios de Audio
                        </span>
                        <span className="text-[10px] text-[#888] text-center">Reinicia los workers de DA GRABA y limpia cache S3.</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
