import { CertificateService } from "@/services/CertificateService"
import { CheckCircle2, XCircle, ShieldCheck, Calendar, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export default async function VerifyPage({ params }: Props) {
  const { id: certificateCode } = await params
  const verification = await CertificateService.verifyCertificate(certificateCode)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 mb-6">
             <div className="text-2xl font-black tracking-tighter">NODLEARN<span className="text-blue-500">.</span></div>
           </div>
           <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
           <p className="text-slate-400">Official registry for course completion and academic integrity.</p>
        </div>

        {verification ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Success Status */}
            <div className="flex flex-col items-center p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
               <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-3" />
               <h2 className="text-xl font-bold text-emerald-400">Verified Authentic</h2>
               <p className="text-slate-400 text-sm mt-1">This certificate is valid and recognized by Nodlearn.</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-xl">
                   <GraduationCap className="h-5 w-5 text-blue-400" />
                 </div>
                 <div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Student Name</div>
                   <div className="font-semibold text-lg capitalize">{verification.name}</div>
                 </div>
               </div>

               <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-xl">
                   <BookOpen className="h-5 w-5 text-blue-400" />
                 </div>
                 <div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Course Title</div>
                   <div className="font-semibold text-lg leading-tight">{verification.course}</div>
                 </div>
               </div>

               <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-xl">
                   <Calendar className="h-5 w-5 text-blue-400" />
                 </div>
                 <div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Completion Date</div>
                   <div className="font-semibold text-lg leading-tight">
                     {new Date(verification.date).toLocaleDateString("en-US", {
                       year: "numeric",
                       month: "long",
                       day: "numeric",
                     })}
                   </div>
                 </div>
               </div>

               <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-xl">
                   <ShieldCheck className="h-5 w-5 text-blue-400" />
                 </div>
                 <div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Credential ID</div>
                   <div className="font-semibold font-mono">{verification.id}</div>
                 </div>
               </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
              <p className="text-xs text-slate-500 text-center px-8 leading-relaxed">
                Nodlearn ensures the highest standards of financial education. This verification guarantees the participant has met all rigorous examination requirements.
              </p>
              <Link
                href="/"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Nodlearn
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 animate-in fade-in duration-700">
            <XCircle className="h-16 w-16 text-rose-500 mb-4" />
            <h2 className="text-2xl font-bold text-rose-500 mb-2">Invalid Certificate</h2>
            <p className="text-slate-400 text-center max-w-xs mb-8">
              We could not find any official record matching this Certificate ID.
              Please verify the characters and try again.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-bold transition-all"
              >
                Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
