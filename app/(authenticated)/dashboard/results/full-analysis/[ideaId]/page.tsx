import React from 'react'
import { FullAnalysisPage } from './FullAnalysis'

type Props = {
    params: Promise<{
        ideaId: string
    }>
}

async function page({params}: Props) {
    const {ideaId}= await params
    // const ideaId = params.ideaId
  return (
   <FullAnalysisPage ideaId={ideaId} />
  )
}

export default page