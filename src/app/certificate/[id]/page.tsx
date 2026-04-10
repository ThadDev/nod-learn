import { CertificateService } from "@/services/CertificateService"
import { notFound } from "next/navigation"
import { ShieldCheck, Award, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CertificatePage({ params, searchParams }: Props) {
  const { id: certificateId } = await params
  const { preview } = await searchParams
  const isPreview = preview === "true"

  const certificate = await CertificateService.getById(certificateId)

  if (!certificate) {
    notFound()
  }

  const { user, course, issuedAt, certificateCode } = certificate
  const courseTitle = course?.title ?? "Financial Literacy Certification"

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-8 ${isPreview ? 'bg-white p-0 m-0' : 'bg-slate-950'}`}>
      <div className={`relative max-w-5xl w-full aspect-[1.414/1] bg-white text-slate-900 shadow-2xl overflow-hidden border-[12px] border-slate-900 rounded-sm`}>
        {/* Elegant Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 border border-slate-200" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30 border border-slate-200" />
        
        {/* Ornate Border Overlay */}
        <div className="absolute inset-4 border border-slate-300 pointer-events-none" />
        <div className="absolute inset-8 border-2 border-slate-900 pointer-events-none" />

        <div className="relative h-full flex flex-col items-center justify-center p-12 md:p-20 text-center">
          {/* Logo / Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tighter uppercase mb-1">
              NODLEARN<span className="text-blue-600">.</span>
            </h2>
            <div className="h-0.5 w-12 bg-blue-600 mx-auto" />
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium mt-2">
              Professional Financial Excellence
            </p>
          </div>

          <Award className="h-16 w-16 text-blue-600 mb-6 drop-shadow-sm" />

          <h1 className="text-4xl md:text-5xl font-serif italic text-slate-800 mb-2">
            Certificate of Achievement
          </h1>
          <p className="text-slate-500 uppercase tracking-widest text-sm mb-10 font-light">
            this is to certify that
          </p>

          <div className="mb-10 w-full max-w-2xl">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 border-b-2 border-slate-100 pb-4 inline-block px-12 capitalize">
              {user.name || "Valued Learner"}
            </h3>
          </div>

          <p className="text-slate-500 text-lg mb-4 max-w-md mx-auto">
            has successfully completed the comprehensive training program for
          </p>
          
          <div className="mb-12">
            <h4 className="text-2xl md:text-3xl font-bold text-blue-600 uppercase tracking-tight">
              {courseTitle}
            </h4>
          </div>

          {/* Details & Signatures */}
          <div className="grid grid-cols-2 gap-16 w-full max-w-3xl mt-auto pt-12 border-t border-slate-100">
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Date of Issue</div>
              <div className="text-lg font-bold text-slate-800">
                {new Date(issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Certificate ID</div>
              <div className="text-lg font-mono font-bold text-slate-800">{certificateCode}</div>
            </div>
          </div>

          <div className="flex justify-between items-end w-full max-w-3xl mt-12 pb-4">
            <div className="text-left">
               <div className="w-48 h-px bg-slate-300 mb-3" />
               <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Authorized Signature</p>
               <p className="text-[10px] text-slate-400">Education Director, Nodlearn</p>
            </div>
            
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-10 w-10 text-emerald-600 mb-2" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Official</p>
            </div>
          </div>

          {/* Verification Link */}
          {!isPreview && (
            <div className="absolute bottom-8 right-8 flex flex-col items-end print:hidden">
              <Link 
                href={`/verify/${certificateCode}`}
                className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"
                target="_blank"
              >
                Verify Authenticity <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
        
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] rotate-[-25deg]">
          <h1 className="text-[10vw] font-black tracking-tighter select-none">NODLEARN OFFICIAL</h1>
        </div>
      </div>
    </div>
  )
}
