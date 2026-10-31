import { LegalDraftPage } from "@/components/legal/LegalDraftPage";

export default function PrivacidadPage() {
  return (
    <LegalDraftPage
      title="Política de privacidad"
      description="Borrador alineado a la Ley 19.628 y a la Ley 21.719. Pendiente de revisión legal."
    >
      <p>
        Este texto explica, en borrador, cómo Muninn trata datos personales. Hoy rige la Ley 19.628
        sobre protección de la vida privada. La Ley 21.719, que moderniza ese régimen y crea la
        Agencia de Protección de Datos Personales, se publicó el 13 de diciembre de 2024 y entra en
        vigencia en diciembre de 2026, tras una vacancia de 24 meses. El texto definitivo tiene que
        decir cuál norma aplica en la fecha de publicación.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Responsable</h2>
      <p>
        El responsable del tratamiento de la plataforma Muninn es quien opera este sitio. El correo
        de contacto está al final de la página y debe confirmarse en la revisión legal (razón
        social, RUT y domicilio todavía no van en este borrador).
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Qué datos hay</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Cuenta: nombre, correo, usuario y la contraseña (el sitio no la muestra de vuelta).</li>
        <li>
          Operación: sucursal, agentes, documentos que subes, reglas y el contenido de las
          conversaciones.
        </li>
        <li>
          Widget público: un identificador anónimo en el navegador del visitante. Nombre y correo
          solo si ese canal los pide.
        </li>
        <li>Registro técnico mínimo para seguridad y soporte (por ejemplo, errores de acceso).</li>
      </ul>
      <h2 className="pt-2 font-display text-lg font-semibold">Para qué</h2>
      <p>
        Para prestar el servicio, autenticar a quien entra, operar los agentes, dar soporte y
        proteger la plataforma. No vendemos bases de datos. La compra de runas se procesa en Flow:
        Muninn guarda el saldo y el historial, no el número de tarjeta.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Encargados y transferencias</h2>
      <p>
        El modelo de IA y las APIs que el cliente conecta (Nubox, un organismo público, un canal de
        mensajería) reciben el contenido necesario para esa llamada. Si ese proveedor está fuera de
        Chile, hay una transferencia internacional. El texto definitivo debe nombrar a esos
        encargados y la base de la transferencia según la Ley 21.719 cuando esté vigente.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Derechos</h2>
      <p>
        Bajo la Ley 19.628 puedes pedir acceso, rectificación, cancelación y bloqueo de tus datos.
        La Ley 21.719, cuando corresponda, suma supresión, oposición y portabilidad, y crea la vía
        ante la Agencia. Para ejercerlos escribe al correo de contacto e indica tu cuenta. Vamos a
        responder en los plazos que fije la norma aplicable.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Conservación y seguridad</h2>
      <p>
        Conservamos la cuenta mientras esté activa y el tiempo que exija una obligación legal. El
        token de sesión no se guarda en localStorage. Cuando el servidor use cookie, esa cookie es
        HttpOnly. Nada de esto reemplaza una evaluación de seguridad formal.
      </p>
      <h2 className="pt-2 font-display text-lg font-semibold">Widget y menores</h2>
      <p>
        El chat embebido muestra un enlace a estos textos. El servicio no está dirigido a niños,
        niñas ni adolescentes. Si un canal pide nombre o correo, el visitante los entrega antes de
        conversar.
      </p>
    </LegalDraftPage>
  );
}
