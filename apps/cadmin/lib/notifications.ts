'use server'

import { Auth } from "@vonage/auth"
import { Vonage } from "@vonage/server-sdk"

const FROM_PHONE = process.env.VONAGE_FROM
const API_KEY = process.env.VONAGE_API_KEY
const SECRET = process.env.VONAGE_SECRET

const auth = new Auth({
    apiKey: API_KEY,
    apiSecret: SECRET
})
const vonage = new Vonage(auth)

export const sendSms = async (phone: string, id: string) => {
    const type: any = 'unicode'
    const from = FROM_PHONE
    const to = `34${phone}`
    const text = `Por favor, confirma tu asistencia a la cena navidena del 28 de Diciembre a las 7 de la tarde de Victor y Laura usando el siguiente enlace. https://evento.gtrrzvictor.com?id=${id}`
    if (!from) throw new Error('Missing Vonage configuration. From phone number is not set')
    return await vonage.sms.send({ to, from, text, type, title: 'welcome to our party!' })
}