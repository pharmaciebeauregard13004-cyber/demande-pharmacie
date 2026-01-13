"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [requestType, setRequestType] = useState("Commande médicaments");
  const [urgent, setUrgent] = useState(false);
  const [wantedDate, setWantedDate] = useState("");

  const [nurseName, setNurseName] = useState("");
  const [nursePhone, setNursePhone] = useState("");
  const [organization, setOrganization] = useState("");

  const [patientLastName, setPatientLastName] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientDob, setPatientDob] = useState("");

  const [items, setItems] = useState([
    { product: "", qty: "" },
    { product: "", qty: "" },
    { product: "", qty: "" }
  ]);

  const [notes, setNotes] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("Livraison au SSIAD");

  function updateItem(idx: number, key: "product" | "qty", value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (nurseName.trim().length < 2 || patientLastName.trim().length < 2 || patientFirstName.trim().length < 2) {
      setStatus("Merci de compléter : Infirmière + Patient (nom/prénom).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        source: "vercel-form",
        createdAt: new Date().toISOString(),
        requestType,
        urgent,
        wantedDate: wantedDate || null,
        deliveryMode,
        nurse: {
          name: nurseName.trim(),
          phone: nursePhone.trim() || null,
          organization: organization.trim() || null
        },
        patient: {
          lastName: patientLastName.trim(),
          firstName: patientFirstName.trim(),
          dob: patientDob || null
        },
        items: items
          .map((i) => ({ product: i.product.trim(), qty: i.qty.trim() }))
          .filter((i) => i.product || i.qty),
        notes: notes.trim() || null
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());

      setStatus("✅ Demande envoyée. Merci !");
      setRequestType("Commande médicaments");
      setUrgent(false);
      setWantedDate("");
      setNurseName("");
      setNursePhone("");
      setOrganization("");
      setPatientLastName("");
      setPatientFirstName("");
      setPatientDob("");
      setItems([
        { product: "", qty: "" },
        { product: "", qty: "" },
        { product: "", qty: "" }
      ]);
      setNotes("");
      setDeliveryMode("Livraison au SSIAD");
    } catch (err: any) {
      setStatus("❌ Envoi impossible : " + (err?.message || "erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto", padding: 16, background: "#f7f7f7", minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "white", padding: 16, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Demande Pharmacie Beauregard</h1>
        <p style={{ marginTop: 0, color: "#555" }}>
          Merci de remplir la demande de façon structurée. Elle sera transmise automatiquement à la pharmacie.
        </p>

        <form onSubmit={onSubmit}>
          <fieldset style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
            <legend style={{ padding: "0 6px" }}>Type de demande</legend>

            <label style={{ display: "block", marginBottom: 8 }}>
              Type
              <select value={requestType} onChange={(e) => setRequestType(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }}>
                <option>Commande médicaments</option>
                <option>Nouvelle ordonnance</option>
                <option>Renouvellement</option>
                <option>Régularisation ordonnance signée</option>
                <option>Demande livraison</option>
                <option>Autre</option>
              </select>
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Mode
              <select value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }}>
                <option>Livraison au SSIAD</option>
                <option>Livraison à domicile</option>
              </select>
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
              Urgent
            </label>

            <label style={{ display: "block" }}>
              Date souhaitée (si applicable)
              <input type="date" value={wantedDate} onChange={(e) => setWantedDate(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>
          </fieldset>

          <div style={{ height: 12 }} />

          <fieldset style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
            <legend style={{ padding: "0 6px" }}>Infirmière coordinatrice</legend>

            <label style={{ display: "block", marginBottom: 8 }}>
              Nom / Prénom *
              <input value={nurseName} onChange={(e) => setNurseName(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Téléphone
              <input value={nursePhone} onChange={(e) => setNursePhone(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>

            <label style={{ display: "block" }}>
              Structure (SSIAD / centre / etc.)
              <input value={organization} onChange={(e) => setOrganization(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>
          </fieldset>

          <div style={{ height: 12 }} />

          <fieldset style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
            <legend style={{ padding: "0 6px" }}>Patient</legend>

            <label style={{ display: "block", marginBottom: 8 }}>
              Nom *
              <input value={patientLastName} onChange={(e) => setPatientLastName(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Prénom *
              <input value={patientFirstName} onChange={(e) => setPatientFirstName(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>

            <label style={{ display: "block" }}>
              Date de naissance
              <input type="date" value={patientDob} onChange={(e) => setPatientDob(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
            </label>
          </fieldset>

          <div style={{ height: 12 }} />

          <fieldset style={{ border: "1px solid #eee", padding: 12, borderRadius: 10 }}>
            <legend style={{ padding: "0 6px" }}>Médicaments (si commande)</legend>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8, marginBottom: 8 }}>
                <input
                  placeholder={`Médicament ${idx + 1}`}
                  value={it.product}
                  onChange={(e) => updateItem(idx, "product", e.target.value)}
                  style={{ padding: 10 }}
                />
                <input
                  placeholder="Qté"
                  value={it.qty}
                  onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  style={{ padding: 10 }}
                />
              </div>
            ))}
          </fieldset>

          <div style={{ height: 12 }} />

          <label style={{ display: "block" }}>
            Notes / précisions
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} style={{ width: "100%", padding: 10, marginTop: 4 }} />
          </label>

          <div style={{ height: 12 }} />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: loading ? "#aaa" : "#111",
              color: "white",
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>

          {status && (
            <p style={{ marginTop: 12, padding: 10, background: "#f3f3f3", borderRadius: 10 }}>
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
