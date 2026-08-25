import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

interface ReportDto {
  reportedUserId?: string;
  reason: string;
  comment?: string;
  timestamp?: string;
}

@Controller()
export class AppController {

  // ── Health Check (used by frontend & Render) ─────────────────────────
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'VYVA Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }

  // ── Root route ────────────────────────────────────────────────────────
  @Get()
  getRoot() {
    return { message: '✅ VYVA API is running. Visit /health for status.' };
  }

  // ── Report Submission ─────────────────────────────────────────────────
  @Post('reports')
  submitReport(@Body() report: ReportDto) {
    console.log('[VYVA MODERATION] New report received:', report);
    // TODO: Persist to DB and trigger moderation review
    return {
      success: true,
      message: 'Report received. Our moderation team will review this profile.',
      reportId: `rpt_${Date.now()}`
    };
  }

  // ── Privacy Policy Page ────────────────────────────────────────────────
  @Get('privacy')
  getPrivacyPolicy(@Res() res: Response) {
    res.type('text/html').send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Politique de Confidentialité – VYVA</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #09090B; color: #E4E4E7; max-width: 720px; margin: 0 auto; padding: 40px 20px; line-height: 1.7; }
    h1 { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #FF4F81, #FF7EB3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
    h2 { font-size: 18px; font-weight: 700; color: #FF7EB3; margin-top: 32px; }
    p, li { color: #A1A1AA; font-size: 14px; }
    ul { padding-left: 20px; }
    .badge { display: inline-block; background: rgba(255,79,129,0.15); border: 1px solid rgba(255,79,129,0.4); color: #FF7EB3; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 24px; }
    a { color: #FF7EB3; }
  </style>
</head>
<body>
  <h1>VYVA</h1>
  <div class="badge">🔒 Politique de Confidentialité</div>
  <p>Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

  <h2>1. Qui sommes-nous ?</h2>
  <p>VYVA est une application de rencontre vidéo en temps réel. Le responsable du traitement des données est l'éditeur de VYVA.</p>

  <h2>2. Données collectées</h2>
  <ul>
    <li>Votre pays de connexion (pour le matchmaking par région).</li>
    <li>Votre préférence de genre de recherche (TOUS, HOMMES, FEMMES).</li>
    <li>Les signalements que vous soumettez.</li>
    <li>Les données de paiement sont traitées par notre partenaire de paiement certifié et ne sont jamais stockées sur nos serveurs.</li>
  </ul>

  <h2>3. Ce que nous ne collectons PAS</h2>
  <ul>
    <li>Nous n'enregistrons aucune conversation vidéo ou audio.</li>
    <li>Nous ne stockons pas d'images ou de captures de votre flux vidéo.</li>
    <li>Nous ne partageons aucune donnée personnelle avec des tiers à des fins publicitaires.</li>
  </ul>

  <h2>4. Caméra et Microphone</h2>
  <p>VYVA accède à votre caméra et votre microphone uniquement lorsque vous démarrez une session de rencontre vidéo. Ces flux sont transmis directement à votre correspondant via WebRTC (connexion pair à pair chiffrée) et ne transitent pas par nos serveurs.</p>

  <h2>5. Mineurs</h2>
  <p>VYVA est strictement réservé aux personnes âgées de 18 ans et plus. Tout profil suspecté d'appartenir à un mineur sera immédiatement banni.</p>

  <h2>6. Vos droits (RGPD)</h2>
  <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer vos droits, contactez-nous à : <a href="mailto:privacy@vyva.app">privacy@vyva.app</a></p>

  <h2>7. Cookies</h2>
  <p>VYVA utilise uniquement des cookies techniques essentiels au fonctionnement de l'application (session, préférences). Aucun cookie publicitaire n'est utilisé.</p>

  <h2>8. Contact</h2>
  <p>Pour toute question concernant cette politique de confidentialité : <a href="mailto:privacy@vyva.app">privacy@vyva.app</a></p>

  <p style="margin-top: 40px; font-size: 12px; color: #52525B;">© ${new Date().getFullYear()} VYVA – Tous droits réservés.</p>
</body>
</html>
    `);
  }
}
