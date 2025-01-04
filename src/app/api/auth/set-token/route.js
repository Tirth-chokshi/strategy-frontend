import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { token } = await request.json()
    
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false }, { status: 400 })
  }
}