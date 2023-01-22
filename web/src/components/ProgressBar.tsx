interface ProgressBarProps {
    progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="h-3 rounded-xl bg-zinc-700 w-full" >
            <div
                role="progressbar"
                aria-label="Progresso de hábitos completados nesse dia"
                aria-valuenow={progress}
                className="bg-violet-600 h-full rounded-xl transition-all"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}