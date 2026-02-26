'use client';

import { Play, UploadCloud, Terminal as TermIcon, FileAudio, Users, Music, Mic2, Scan, Activity, Zap, BarChart3, Binary } from 'lucide-react';

export function AITrainingModule() {
    const [trainingType, setTrainingType] = useState<'voice' | 'instrument' | 'mastering'>('voice');
    const [selectedArtist, setSelectedArtist] = useState<string>('');
    const [modelName, setModelName] = useState<string>('');
    const [audioFiles, setAudioFiles] = useState<any[]>([]);
    const [rawAudio, setRawAudio] = useState<File | null>(null);
    const [masteredAudio, setMasteredAudio] = useState<File | null>(null);
    const [dnaProfileName, setDnaProfileName] = useState<string>('');
    const [dnaGenre, setDnaGenre] = useState<string>('DGB_BACHATA');
    const [dnaResult, setDnaResult] = useState<any>(null);
    const [epochs, setEpochs] = useState<number>(100);
    const [isTraining, setIsTraining] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const handleAnalyzeDNA = async () => {
        if (!rawAudio || !masteredAudio || !dnaProfileName) return;

        setIsAnalyzing(true);
        setLogs(prev => [...prev, `[INIT] Iniciando Análisis de ADN DGB: ${dnaProfileName}`]);
        setLogs(prev => [...prev, `[DSP] Comparando señales Mix vs Master...`]);

        try {
            // Convert files to base64 for the prototype
            const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });

            const rawBase64 = await toBase64(rawAudio);
            const masteredBase64 = await toBase64(masteredAudio);

            const response = await fetch('/api/ai/analyze-dna', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rawAudio: rawBase64,
                    masteredAudio: masteredBase64,
                    profileName: dnaProfileName,
                    genre: dnaGenre
                })
            });

            const data = await response.json();
            if (data.success) {
                setDnaResult(data.dna);
                setLogs(prev => [...prev, `[SUCCESS] ADN extraído con éxito. LUFS Target: ${data.dna.loudness.target_lufs}`]);
                setLogs(prev => [...prev, `[DATABASE] Perfil Guardado en el Gold Standard.`]);
            } else {
                setLogs(prev => [...prev, `[ERROR] ${data.error || 'Fallo en el análisis.'}`]);
            }
        } catch (error) {
            setLogs(prev => [...prev, `[ERROR] Error de comunicación con el Scanner.`]);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleTrain = async () => {
        if (trainingType === 'voice' && (!selectedArtist || audioFiles.length === 0)) return;
        if (trainingType === 'instrument' && !modelName) return;
        if (trainingType === 'mastering') {
            await handleAnalyzeDNA();
            return;
        }

        setIsTraining(true);
        setLogs(prev => [...prev, `[INIT] Iniciando proceso de entrenamiento: ${trainingType === 'voice' ? selectedArtist : modelName}`]);

        if (trainingType === 'instrument') {
            try {
                setLogs(prev => [...prev, `[API] Contactando backend de entrenamiento Instrumental...`]);
                const response = await fetch('/api/ai/train/sao', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: modelName,
                        description: `Entrenamiento de orquesta instrumental: ${modelName}`,
                        tags: ['instrumental', 'orchestra'],
                        midiFolder: 'sao-instrumental-finetune/dataset-creator/clean_midi'
                    })
                });
                const data = await response.json();
                setLogs(prev => [...prev, `[MODAL] Job ID generado: ${data.modelId || 'pending'}`]);
                setLogs(prev => [...prev, `[GPU] Reservando cluster para Stable Audio Open...`]);
            } catch (error) {
                setLogs(prev => [...prev, `[ERROR] Fallo al iniciar entrenamiento instrumental.`]);
            }
        } else {
            setTimeout(() => {
                setLogs(prev => [...prev, `[MODAL] Dispatching job: Voice_Cloning_V1`]);
            }, 1000);
        }

        setTimeout(() => {
            setLogs(prev => [...prev, `[GPU] Asignando A100... Éxito`]);
            setLogs(prev => [...prev, `[TRAIN] Iniciando Epoch 1/${epochs}`]);
        }, 2500);

        setTimeout(() => {
            setLogs(prev => [...prev, `[TRAIN] Completado. Guardando pesos del modelo...`]);
            setIsTraining(false);
        }, 6000);
    };

    return (
        <section id="modal" className="bg-[#0A0A0C]/80 backdrop-blur-md border border-[#333] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md">
                        <TermIcon size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">THE BRAIN CONFIG</h2>
                        <p className="text-xs text-[#888]">Gestión de IA y Modelos en Modal.com</p>
                    </div>
                </div>

                {/* Training Type Toggle */}
                <div className="flex bg-[#111] p-1 rounded-lg border border-[#222]">
                    <button
                        onClick={() => setTrainingType('voice')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${trainingType === 'voice' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-[#444] hover:text-[#888]'
                            }`}
                    >
                        <Mic2 size={12} /> VOZ
                    </button>
                    <button
                        onClick={() => setTrainingType('instrument')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${trainingType === 'instrument' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'text-[#444] hover:text-[#888]'
                            }`}
                    >
                        <Music size={12} /> INSTRUMENTO
                    </button>
                    <button
                        onClick={() => setTrainingType('mastering')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all flex items-center gap-2 ${trainingType === 'mastering' ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.3)]' : 'text-[#444] hover:text-[#888]'
                            }`}
                    >
                        <Scan size={12} /> MASTERING DNA
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Form */}
                <div className="flex flex-col gap-6">
                    {trainingType === 'voice' && (
                        <>
                            {/* Artist Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                                    <Users size={14} /> ARTISTA DE DESTINO
                                </label>
                                <select
                                    className="bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-[#E0E0E0] outline-none focus:border-purple-500 transition-colors"
                                    value={selectedArtist}
                                    onChange={(e) => setSelectedArtist(e.target.value)}
                                >
                                    <option value="">Seleccionar Artista</option>
                                    <option value="danny">Danny (Admin)</option>
                                    <option value="khea">Khea (Invitado)</option>
                                    <option value="duki">Duki (Invitado)</option>
                                </select>
                            </div>

                            {/* Audio Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                                    <FileAudio size={14} /> AUDIO DATASET (10 Min)
                                </label>
                                <div className="border-2 border-dashed border-[#333] rounded-md p-6 flex flex-col items-center justify-center gap-3 hover:border-purple-500 hover:bg-[#111] transition-all cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="audio/*"
                                        onChange={(e) => {
                                            if (e.target.files) setAudioFiles(Array.from(e.target.files));
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <UploadCloud size={32} className="text-[#666]" />
                                    <span className="text-sm font-bold text-[#AAA]">Arrastra audios aquí o haz clic</span>
                                    <span className="text-xs text-[#555]">{audioFiles.length} archivos seleccionados</span>
                                </div>
                            </div>
                        </>
                    )}

                    {trainingType === 'instrument' && (
                        <>
                            {/* Instrument Model Configuration */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                                    <Music size={14} /> NOMBRE DEL INSTRUMENTO
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Bolero Orchestra V1"
                                    className="bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-[#E0E0E0] outline-none focus:border-indigo-500 transition-colors"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                />
                            </div>

                            <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-lg flex flex-col gap-2">
                                <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">Dataset Detectado</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[#E0E0E0]">Orquesta / Instrumentales</span>
                                    <span className="text-[10px] font-mono text-[#555]">/sao-instrumental-finetune</span>
                                </div>
                            </div>
                        </>
                    )}

                    {trainingType === 'mastering' && (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#888] tracking-widest flex items-center gap-2">
                                    <Zap size={14} /> NOMBRE DEL PERFIL SÓNICO
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: DGB_BACHATA_GOLD_MASTER"
                                    className="bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-[#E0E0E0] outline-none focus:border-orange-500 transition-colors"
                                    value={dnaProfileName}
                                    onChange={(e) => setDnaProfileName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#888] tracking-widest">GÉNERO MUSICAL</label>
                                <select
                                    className="bg-[#111] border border-[#333] rounded-md px-4 py-2 text-sm text-[#E0E0E0] outline-none focus:border-orange-500 transition-colors"
                                    value={dnaGenre}
                                    onChange={(e) => setDnaGenre(e.target.value)}
                                >
                                    <option value="DGB_BACHATA">Bachata DGB</option>
                                    <option value="DGB_BOLERO">Bolero DGB</option>
                                    <option value="DGB_TRAP">Trap DGB</option>
                                    <option value="DGB_MERENGUE">Merengue DGB</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#666] tracking-tighter uppercase">Mixdown (Crudo)</label>
                                    <div className="border border-[#333] rounded bg-[#111] p-3 flex flex-col items-center gap-2 relative h-24 justify-center">
                                        <input 
                                            type="file" 
                                            accept="audio/*" 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setRawAudio(e.target.files?.[0] || null)}
                                        />
                                        <FileAudio size={20} className={rawAudio ? "text-orange-500" : "text-[#444]"} />
                                        <span className="text-[10px] text-center line-clamp-1">{rawAudio ? rawAudio.name : "Subir Mix"}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-[#666] tracking-tighter uppercase">Master (Danny)</label>
                                    <div className="border border-[#333] rounded bg-[#111] p-3 flex flex-col items-center gap-2 relative h-24 justify-center">
                                        <input 
                                            type="file" 
                                            accept="audio/*" 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setMasteredAudio(e.target.files?.[0] || null)}
                                        />
                                        <Activity size={20} className={masteredAudio ? "text-orange-500" : "text-[#444]"} />
                                        <span className="text-[10px] text-center line-clamp-1">{masteredAudio ? masteredAudio.name : "Subir Master"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Epochs Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#888] tracking-widest flex items-center justify-between">
                            <span>EPOCHS DE ENTRENAMIENTO</span>
                            <span className={trainingType === 'voice' ? 'text-purple-400' : 'text-indigo-400'}>{epochs}</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="500"
                            step="10"
                            value={epochs}
                            onChange={(e) => setEpochs(Number(e.target.value))}
                            className={`w-full ${trainingType === 'voice' ? 'accent-purple-500' : 'accent-indigo-500'}`}
                        />
                    </div>

                    {/* Execute Button */}
                    <button
                        onClick={handleTrain}
                        disabled={isTraining || isAnalyzing || (trainingType === 'voice' ? (!selectedArtist || audioFiles.length === 0) : trainingType === 'instrument' ? !modelName : (!dnaProfileName || !rawAudio || !masteredAudio))}
                        className={`mt-4 py-4 rounded-md flex items-center justify-center gap-3 font-black tracking-widest text-lg transition-all ${isTraining || isAnalyzing || (trainingType === 'voice' ? (!selectedArtist || audioFiles.length === 0) : trainingType === 'instrument' ? !modelName : (!dnaProfileName || !rawAudio || !masteredAudio))
                                ? 'bg-[#222] text-[#555] border border-[#333] cursor-not-allowed'
                                : trainingType === 'voice'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] border border-purple-400'
                                    : trainingType === 'instrument'
                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] border border-indigo-400'
                                        : 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.5)] hover:shadow-[0_0_30px_rgba(234,88,12,0.8)] border border-orange-400'
                            }`}
                    >
                        {isAnalyzing ? (
                            <div className="flex items-center gap-2 animate-pulse">
                                <Zap className="animate-spin" size={24} /> ESCANEANDO ADN...
                            </div>
                        ) : (
                            <>
                                <Play size={24} fill={(!isTraining && ((trainingType === 'voice' && selectedArtist && audioFiles.length > 0) || (trainingType === 'instrument' && modelName) || (trainingType === 'mastering' && rawAudio && masteredAudio && dnaProfileName))) ? "currentColor" : "none"} />
                                {trainingType === 'voice' ? 'ENTRENAR VOZ' : trainingType === 'instrument' ? 'ENTRENAR INSTRUMENTO' : 'ESCANEAR ADN MASTERING'}
                            </>
                        )}
                    </button>
                </div>

                {/* Logs Console */}
                <div className="bg-[#050505] rounded-md border border-[#222] p-4 flex flex-col font-mono text-xs overflow-hidden h-[400px] shadow-inner relative">
                    <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#111] to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#333]">
                        <span className="text-[#555] uppercase tracking-widest font-bold">Terminal Modal Output</span>
                        {isTraining && <span className="flex h-2 w-2 relative">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${trainingType === 'voice' ? 'bg-purple-400' : 'bg-indigo-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${trainingType === 'voice' ? 'bg-purple-500' : 'bg-indigo-500'}`}></span>
                        </span>}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 text-[#AAA]">
                        {logs.length === 0 && (
                            <span className="text-[#444] italic">Esperando inicialización de la GPU...</span>
                        )}
                        {logs.map((log, index) => (
                            <div key={index} className="break-words">
                                <span className={`${log.includes('SUCCESS') ? 'text-green-500' : log.includes('ERROR') ? 'text-red-500' : 'text-[#00F0FF]'} mr-2`}>{`>`}</span>
                                <span className={log.includes('Éxito') || log.includes('Completado') || log.includes('SUCCESS') ? 'text-green-400' : 'text-[#DDD]'}>
                                    {log}
                                </span>
                            </div>
                        ))}
                        
                        {dnaResult && (
                            <div className="mt-4 p-4 bg-orange-900/20 border border-orange-500/30 rounded-md flex flex-col gap-3 font-sans animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 text-orange-400 font-bold border-b border-orange-500/20 pb-2">
                                    <Binary size={16} /> ADN SÓNICO DE DGB DETECTADO
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-[10px]">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[#666] uppercase">Loudness (LUFS)</span>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#AAA]">Input:</span>
                                            <span className="text-white bg-[#222] px-1 rounded">{dnaResult.loudness.input_lufs}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#AAA]">Target:</span>
                                            <span className="text-orange-400 bg-orange-900/30 px-1 rounded">{dnaResult.loudness.target_lufs}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#AAA]">Gain Lift:</span>
                                            <span className="text-green-400">+{dnaResult.loudness.gain_lift_db} dB</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[#666] uppercase">Dinámica</span>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#AAA]">Crest Factor:</span>
                                            <span className="text-white bg-[#222] px-1 rounded">{dnaResult.dynamics.crest_factor}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#AAA]">Peak Ceiling:</span>
                                            <span className="text-white bg-[#222] px-1 rounded">{dnaResult.dynamics.peak_ceiling} dB</span>
                                        </div>
                                        <div className="mt-2 text-[9px] text-[#555] italic">
                                            Curva de EQ Match{` {${dnaResult.spectral_envelope.frequencies.length}}`} puntos.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 bg-black/40 p-2 rounded border border-orange-500/10">
                                    <BarChart3 size={14} className="text-orange-500" />
                                    <span className="text-[9px] text-orange-200/60 uppercase tracking-widest">Modelo de entrenamiento Modal.com actualizado</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
