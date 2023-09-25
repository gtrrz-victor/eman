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
    const from = FROM_PHONE
    const to = `34${phone}rr`
    const text = 'Update your details for our upcoming event https://evento.gtrrzvictor.com?id=' + id
    if (!from) throw new Error('Missing Vonage configuration. From phone number is not set')
    return await vonage.sms.send({ to, from, text, title: 'welcome to our party!' })
}