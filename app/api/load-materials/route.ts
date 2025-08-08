import { NextResponse } from 'next/server'
import { loadMaterialFiles } from '@/lib/material-loader'

export async function GET() {
  try {
    const materials = loadMaterialFiles()
    
    return NextResponse.json({ 
      materials,
      count: materials.length,
      topics: [...new Set(materials.map(m => m.topic))]
    })
  } catch (error) {
    console.error('Error loading materials:', error)
    return NextResponse.json(
      { error: 'Error al cargar los materiales' },
      { status: 500 }
    )
  }
}
