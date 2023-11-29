import SendIcon from "@mui/icons-material/Send";
import {
    Box,
    Button,
    Checkbox,
    Container,
    Fade,
    FormControlLabel,
    Radio,
    RadioGroup,
    Slide,
    TextField
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { readGuest } from "./api/readGuest";
import { updateGuest } from "./api/updateGuest";

declare global {
    interface Window {
        gtag: (arg1: string, arg2: string, opts: any) => void;
    }
}

export function App() {
    const guestId = useMemo(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    }, []);
    const [hasBeenSent, setHasBeenSent] = useState(false);
    const [valid, setValid] = useState(false);
    const [address, setAddress] = useState("");
    const [hideAddress, setHideAddress] = useState(false);
    const [assisting, setAssisting] = useState<boolean>();
    const [more, setMore] = useState<boolean>();
    const [additionalPeople, setAdditionalPeople] = useState(0);
    const userQuery = useQuery(
        ["user", guestId],
        () => {
            if (guestId) return readGuest(guestId);
        },
        {
            retry: false,
            enabled: guestId !== null,
        }
    );
    const sendGuestData = () => {
        if (!guestId || assisting === undefined) return;
        try {
            updateGuest(guestId, {
                isAssisting: assisting,
                additionalPeople,
                address: hideAddress ? "" : address,
            });
            setHasBeenSent(true);
            window.gtag('event', 'data_sent', {
                assisting
            })
        } catch (err) {
            console.error(err);
        }
    };
    const handleAssistingChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setAssisting((event.target as HTMLInputElement).value === "true");
    };
    const handleMoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMore((event.target as HTMLInputElement).value === "true");
    };
    const handleHideAddressChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setHideAddress(event.target.checked);
    };
    useEffect(() => {
        setValid(
            (assisting !== undefined && more !== undefined) || assisting === false
        );
    }, [assisting, more]);
    if (userQuery.isLoading || !userQuery.data) return <></>;
    const { Item: guest } = userQuery.data;
    return (
        <div>
            {!hasBeenSent && (

                <Box display='flex' justifyContent='center'>
                    <img
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                        }}
                        src="/assets/cover.png"
                        alt="We are ready!"
                        loading="lazy" />
                </Box>
            )}
            <CssBaseline />
            <Container maxWidth="sm" style={{ padding: '10px' }}>
                {!hasBeenSent && (<>
                    <Box
                        display="flex"
                        justifyContent="start"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <h1>Merendola</h1>
                        <h2>
                            28 de Diciembre
                        </h2>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="start"
                        flexDirection="column"
                        alignItems="start"
                    >
                        <p>Hola {guest.name}!!</p>
                        <p>Como ya te habremos comentado por Whatsapp.</p>
                        <p>
                            Contamos contigo para la merendola que estamos organizando para el
                            Jueves 28 de Diciembre 2023 en Cafe del Rio de 7 a 10 de la tarde.
                        </p>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12150.544101613896!2d-3.7232444!3d40.4169133!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42280b5167a5ed%3A0x4823b391a4d43c3e!2sRiver%20Caf%C3%A9!5e0!3m2!1sen!2sau!4v1700793881238!5m2!1sen!2sau" width="100%" height="450" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ border: 0 }}></iframe>
                        <p>Solo necesitamos tu confirmacion</p>
                        <span>
                            Podras venir?{" "}
                            <RadioGroup
                                row
                                value={assisting ?? ""}
                                onChange={handleAssistingChange}
                            >
                                <FormControlLabel
                                    value={"true"}
                                    control={<Radio />}
                                    label="Si" />
                                <FormControlLabel
                                    value={"false"}
                                    control={<Radio />}
                                    label="No" />
                            </RadioGroup>
                        </span>
                        <Fade in={assisting} unmountOnExit>
                            <div>
                                <span>
                                    No se si lo sabras, pero tambien hemos invitado a:
                                    <ul>
                                        {guest.relatives.map((name, index) => (<li key={index}>{name}</li>))}
                                    </ul>
                                    Vendras acompa&ntilde;ado/a con alguien mas a parte de la gente que ya hemos invitado?{" "}
                                    <RadioGroup
                                        row
                                        value={more ?? ""}
                                        onChange={handleMoreChange}
                                    >
                                        <FormControlLabel
                                            value={"true"}
                                            control={<Radio />}
                                            label="Si" />
                                        <FormControlLabel
                                            value={"false"}
                                            control={<Radio />}
                                            label="No" />
                                    </RadioGroup>
                                </span>
                                <Fade in={more} unmountOnExit>
                                    <TextField
                                        type="number"
                                        label={<span>Numero de acompa&ntilde;antes</span>}
                                        variant="outlined"
                                        color="success"
                                        onChange={(e) => {
                                            const num = parseInt(e.target.value || "0");
                                            if (num <= 0) return;
                                            setAdditionalPeople(num);
                                        }}
                                        value={additionalPeople} />
                                </Fade>
                                <p>Por ultimo solo necesitariamos tu direccion postal..</p>
                                <TextField
                                    disabled={hideAddress}
                                    color="success"
                                    fullWidth
                                    label="Direccion postal"
                                    multiline
                                    rows={4}
                                    value={address}
                                    onChange={(event) => {
                                        setAddress(event.target.value);
                                    }}
                                    placeholder="C/Sagasta 12..." />
                                <span>
                                    Prefiero no compartir mi direccion{" "}
                                    <Checkbox
                                        color="success"
                                        checked={hideAddress}
                                        onChange={handleHideAddressChange}
                                    ></Checkbox>
                                </span>
                            </div>
                        </Fade>

                        <Box>
                            <Button
                                onClick={() => sendGuestData()}
                                disabled={!valid}
                                color="success"
                                variant="outlined"
                                endIcon={<SendIcon />}
                            >
                                Enviar!
                            </Button>
                        </Box>
                    </Box>
                </>
                )}
            </Container>
            <Slide direction="up" in={hasBeenSent} unmountOnExit>
                <Container maxWidth="sm" style={{ padding: '10px', textAlign: 'center' }}>
                    <Box
                        display="flex"
                        justifyContent="start"
                        flexDirection="column"
                        alignItems="center"
                    >
                        {
                            assisting && (
                                <>
                                    <h2>Muchas gracias!!</h2>
                                    <h2>Te estaremos esperando!</h2>
                                    <Button target="_blank" variant="outlined" href="https://www.addevent.com/event/NL19421027">Recuerdame!</Button>
                                    <img
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "5px",
                                            maxWidth: "90vh",
                                            height: "auto",
                                        }}
                                        src="/assets/we_are_ready.jpg"
                                        alt="We are ready!"
                                        loading="lazy" />
                                    <h2>Que sepas que...</h2>
                                    <h2>Ya estamos plantando la cena!</h2>
                                    <img
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "5px",
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                        src="/assets/fresh_product.jpg"
                                        alt="Getting the product ready!"
                                        loading="lazy" />

                                    <h2>Y no, no te preocupes...</h2>
                                    <h2>que no pasaras hambre</h2>
                                    <img
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "5px",
                                            maxWidth: "100%",
                                            height: "auto",
                                        }}
                                        src="/assets/hungry.jpg"
                                        alt="No empty tummy!"
                                        loading="lazy" />
                                </>
                            )
                        }{
                            !assisting && (
                                <>
                                    <h2>Es una pena, pero nos veremos de todas formas!</h2>
                                    <img
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            padding: "5px",
                                            maxWidth: "90vh",
                                            height: "auto",
                                        }}
                                        src="/assets/we_are_ready.jpg"
                                        alt="We are ready!"
                                        loading="lazy" />
                                </>
                            )
                        }

                    </Box>

                </Container>

            </Slide>
        </div>
    );
}
