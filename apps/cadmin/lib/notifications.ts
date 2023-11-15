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
    const to = `34${phone}`
    const text = `Los australianos estamos aprendiendo que en nuestras visitas se nos quedan demasiadas personitas bonitas sin abrazar. Asi que para la próxima expedición queremos asegurarnos de que al menos una cervecita nos tomamos todos juntos. Estaremos por allí en diciembre así que reservad el día 28, jueves por la tarde. Por supuesto parejas, niños, mascotas y amigos imaginarios invitados. Os confirmamos sitio y hora cuando se acerque la fecha. Pero no hagáis planes para ese día 😉. Antes de que llenéis la agenda de eventos navideños, recordad que el 28 de diciembre a las 7 de la tarde tenéis una cita para tomar una cervecita con sabor australiano. Os enviamos un mensaje de texto para que nos confirméis si podéis venir y con quien que estamos haciendo números con la fábrica de Maohu 😉.
    Por favor, confirma tu asistencia usando este enlace! https://evento.gtrrzvictor.com?id=${id}
    No es spam!! Si tienes dudas, manda o a Laura o a Victor un mensaje para confirmar la veracidad es esta notificacion.`
    if (!from) throw new Error('Missing Vonage configuration. From phone number is not set')
    return await vonage.sms.send({ to, from, text, title: 'welcome to our party!' })
}