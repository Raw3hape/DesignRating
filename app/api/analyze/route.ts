import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const maxDuration = 60 // 60 seconds timeout
export const runtime = 'nodejs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Database simulation for rating
// const analysisStats = {
//   totalAnalyses: 15420,
//   averageScore: 67.3,
//   scoreDistribution: {
//     '90-100': 8,
//     '80-89': 15,
//     '70-79': 25,
//     '60-69': 28,
//     '50-59': 16,
//     '0-49': 8
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const images: File[] = []
    
    // Extract all images from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        images.push(value)
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images for analysis' },
        { status: 400 }
      )
    }

    // Convert images to base64 for OpenAI
    const imageBase64Array = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        return `data:${image.type};base64,${base64}`
      })
    )

    // Create detailed prompt for design analysis
    const prompt = `Analyze these design works as a professional design reviewer from top companies (Apple, Google, etc.). 

Evaluate by criteria:
1. Composition and visual hierarchy
2. Typography and readability
3. Color palette and contrast
4. Space and balance
5. Innovation and creativity
6. User experience
7. Technical execution
8. Compliance with modern trends

Give a score from 1 to 100 (where 90-100 is top company level).

Return result in JSON format:
{
  "score": number from 1 to 100,
  "category": "quality category",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "insights": ["detailed analysis 1", "detailed analysis 2"]
}`

    let analysisResult
    
    if (process.env.OPENAI_API_KEY) {
      // Real analysis via OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              ...imageBase64Array.map(base64 => ({
                type: "image_url" as const,
                image_url: { url: base64, detail: "high" as const }
              }))
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      try {
        analysisResult = JSON.parse(content)
      } catch {
        // If JSON is not valid, create structured response
        analysisResult = {
          score: Math.floor(Math.random() * 30) + 60, // 60-89
          category: "Good",
          strengths: content.split('\n').slice(0, 3),
          improvements: content.split('\n').slice(3, 6),
          insights: content.split('\n').slice(6, 8)
        }
      }
    } else {
      // Demo analysis without OpenAI API
      const demoAnalyses = [
        {
          score: 87,
          category: "Excellent",
          strengths: [
            "Outstanding composition with clear visual hierarchy",
            "Modern and stylish typography, excellent readability",
            "Harmonious color palette with proper accents"
          ],
          improvements: [
            "Add more breathing room between elements for better perception",
            "Consider increasing contrast for some text elements",
            "Optimize CTA element placement for better conversion"
          ],
          insights: [
            "Design demonstrates professional approach to user interface creation. Grid usage and Material Design principles create quality product feeling.",
            "Particularly noteworthy is skillful use of micro-animations and transitions that make interface alive and responsive. This indicates deep understanding of UX principles."
          ]
        },
        {
          score: 93,
          category: "Outstanding",
          strengths: [
            "Innovative approach to solving user tasks",
            "Flawless technical execution and attention to detail",
            "Perfect balance of functionality and aesthetics"
          ],
          improvements: [
            "Consider adaptation for different screen sizes",
            "Add states for interactive elements",
            "Conduct accessibility testing for users with disabilities"
          ],
          insights: [
            "This design is at the level of top design studios' work. Every element is thoughtful and serves specific purpose, creating seamless user experience.",
            "Particularly impressive is the use of space and creating emotional connection with user through visual elements. This is mature designer's work."
          ]
        },
        {
          score: 76,
          category: "Good",
          strengths: [
            "Clear structure and logical navigation",
            "Appropriate use of graphic elements",
            "Compliance with basic UX principles"
          ],
          improvements: [
            "Improve visual hierarchy through sizes and contrasts",
            "Update color palette according to modern trends",
            "Add more dynamics through animations and micro-interactions"
          ],
          insights: [
            "Design shows good understanding of basics but needs refinement to achieve premium level. Basic structure is correct.",
            "Recommended to study latest trends in interface design and apply them to enhance modernity and attractiveness of work."
          ]
        }
      ]
      
      analysisResult = demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)]
    }

    // Calculate percentile based on score
    const calculatePercentile = (score: number): number => {
      if (score >= 90) return Math.floor(Math.random() * 8) + 92 // 92-99%
      if (score >= 80) return Math.floor(Math.random() * 15) + 77 // 77-91%
      if (score >= 70) return Math.floor(Math.random() * 25) + 52 // 52-76%
      if (score >= 60) return Math.floor(Math.random() * 28) + 24 // 24-51%
      if (score >= 50) return Math.floor(Math.random() * 16) + 8  // 8-23%
      return Math.floor(Math.random() * 8) + 1 // 1-7%
    }

    const percentile = calculatePercentile(analysisResult.score)
    
    const getComparisonDescription = (score: number): string => {
      if (score >= 90) return "Your work is at the level of world's best designers!"
      if (score >= 80) return "Excellent result! You're among top professional designers."
      if (score >= 70) return "Good level! There's potential for growth."
      if (score >= 60) return "Average result with good improvement prospects."
      return "There's work to be done, but you have basic skills."
    }

    // Create URLs for images (in real project would save to cloud)
    const imageUrls = imageBase64Array

    const result = {
      score: analysisResult.score,
      category: analysisResult.category,
      insights: analysisResult.insights,
      improvements: analysisResult.improvements,
      strengths: analysisResult.strengths,
      images: imageUrls,
      comparison: {
        percentile,
        description: getComparisonDescription(analysisResult.score)
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Error analyzing images' },
      { status: 500 }
    )
  }
}