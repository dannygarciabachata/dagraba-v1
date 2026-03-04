'use client';

import React, { useState } from 'react';
import { Settings, Globe, Power, HardDrive, AlertTriangle, Settings2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function SystemConfig() {
    const { getIdToken } = useAuth();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('us-east-1');
    const [apiKey, setApiKey] = useState('');
    const [musicGptKey, setMusicGptKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const token = await getIdToken();
                if (!token) return;

                const resKie = await fetch('/api/admin/settings?key=KIE_API_KEY', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataKie = await resKie.json();
                if (dataKie.success && dataKie.setting) {
                    setApiKey(dataKie.setting.value);
                }

                const resMusicGpt = await fetch('/api/admin/settings?key=MUSICGPT_API_KEY', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataMusicGpt = await resMusicGpt.json();
                if (dataMusicGpt.success && dataMusicGpt.setting) {
                    setMusicGptKey(dataMusicGpt.setting.value);
                }

                const resMaint = await fetch('/api/admin/settings?key=MAINTENANCE_MODE', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataMaint = await resMaint.json();
                if (dataMaint.success && dataMaint.setting) {
                    setMaintenanceMode(dataMaint.setting.value === 'true');
                }
            } catch (error) {
                console.error('Failed to fetch API Key', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApiKey();
    }, []);

    const handleSaveKey = async (keyName: string, keyValue: string) => {
        try {
            const token = await getIdToken();
            if (!token) {
                alert('No se pudo obtener el token de sesión.');
                return;
            }

            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key: keyName, value: keyValue, category: 'ai_engine' })
            });
            const data = await res.json();
            if (data.success) {
                alert(`API Key ${keyName} actualizada correctamente.`);
            } else {
                alert(`Hubo un error al guardar la API Key ${keyName}.`);
            }
        } catch (error) {
            console.error(`Error saving key ${keyName}:`, error);
            alert('Error de conexión.');
        }
    };

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
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                            <AlertTriangle size={14} className={maintenanceMode ? "text-red-500" : ""} /> MODO MANTENIMIENTO
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-[#E0E0E0] outline-none focus:border-[#00F0FF] transition-colors"
                                value={maintenanceMode ? "true" : "false"}
                                onChange={(e) => setMaintenanceMode(e.target.value === "true")}
                            >
                                <option value="false">Desactivado (Sitio Público)</option>
                                <option value="true">Activado (Solo Admin)</option>
                            </select>
                            <button
                                onClick={() => handleSaveKey('MAINTENANCE_MODE', maintenanceMode.toString())}
                                disabled={isLoading}
                                className="bg-[#222] hover:bg-[#333] text-white border border-[#444] px-4 py-2 rounded text-xs font-bold tracking-widest transition-colors disabled:opacity-50"
                            >
                                {isLoading ? '...' : 'SAVE'}
                            </button>
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
                                placeholder={isLoading ? "Cargando..." : "sk_..."}
                                disabled={isLoading}
                                className="flex-1 bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-white font-mono outline-none focus:border-[#00F0FF] transition-colors"
                            />
                            <button
                                onClick={() => handleSaveKey('KIE_API_KEY', apiKey)}
                                disabled={isLoading}
                                className="bg-[#222] hover:bg-[#333] text-white border border-[#444] px-4 py-2 rounded text-xs font-bold tracking-widest transition-colors disabled:opacity-50"
                            >
                                {isLoading ? '...' : 'SAVE'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                            <HardDrive size={14} /> MUSICGPT API KEY
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={musicGptKey}
                                onChange={(e) => setMusicGptKey(e.target.value)}
                                placeholder={isLoading ? "Cargando..." : "sk_..."}
                                disabled={isLoading}
                                className="flex-1 bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-white font-mono outline-none focus:border-[#00F0FF] transition-colors"
                            />
                            <button
                                onClick={() => handleSaveKey('MUSICGPT_API_KEY', musicGptKey)}
                                disabled={isLoading}
                                className="bg-[#222] hover:bg-[#333] text-white border border-[#444] px-4 py-2 rounded text-xs font-bold tracking-widest transition-colors disabled:opacity-50"
                            >
                                {isLoading ? '...' : 'SAVE'}
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

                    <button
                        onClick={async () => {
                            if (confirm('¿Estás seguro de que quieres reiniciar el asistente de configuración? Esto permitirá volver a entrar a /setup.')) {
                                try {
                                    const token = await getIdToken();
                                    if (!token) return;

                                    const res = await fetch('/api/admin/settings', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ key: 'INITIAL_SETUP_COMPLETED', value: 'false', category: 'system' })
                                    });
                                    if (res.ok) {
                                        alert('Asistente reiniciado. Redirigiendo...');
                                        window.location.href = '/setup';
                                    }
                                } catch (error) {
                                    alert('Error al reiniciar el asistente.');
                                }
                            }
                        }}
                        className="bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded-md p-4 flex flex-col items-center justify-center gap-2 mt-2 transition-colors group"
                    >
                        <Settings2 size={24} className="text-red-500 group-hover:rotate-45 transition-transform" />
                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest text-center">
                            Reset Setup Wizard
                        </span>
                        <span className="text-[10px] text-red-500/70 text-center">Permite re-configurar el sistema desde cero.</span>
                    </button>
                </div>

            </div>
        </section>
    );
}
