interface InviteEmailParams {
  workspaceName: string
  inviterName: string
  role: 'admin' | 'member'
  inviteUrl: string
  expiresInDays?: number
}

export function buildInviteEmailHtml(params: InviteEmailParams): string {
  const { workspaceName, inviterName, role, inviteUrl, expiresInDays = 7 } = params
  const roleLabel = role === 'admin' ? 'Administrador' : 'Membro'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Convite para ${workspaceName}</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#1a1d2e;border-radius:12px;border:1px solid #2a2d3e;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid #2a2d3e;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#6366f1;width:32px;height:32px;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:14px;font-weight:700;line-height:32px;">P</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#e2e8f0;font-size:15px;font-weight:600;">PipeFlow</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f1f5f9;">
                Você foi convidado
              </h1>
              <p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.6;">
                <strong style="color:#e2e8f0;">${inviterName}</strong> convidou você para fazer parte do workspace
                <strong style="color:#e2e8f0;">${workspaceName}</strong> como <strong style="color:#e2e8f0;">${roleLabel}</strong>.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#6366f1;border-radius:8px;">
                    <a href="${inviteUrl}"
                       style="display:inline-block;padding:12px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
                      Aceitar convite
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                Ou copie e cole o link abaixo no seu navegador:
              </p>
              <p style="margin:0;font-size:12px;color:#6366f1;word-break:break-all;">
                ${inviteUrl}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #2a2d3e;">
              <p style="margin:0;font-size:12px;color:#475569;">
                Este convite expira em ${expiresInDays} dias. Se você não esperava receber este e-mail, pode ignorá-lo com segurança.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildInviteEmailSubject(workspaceName: string): string {
  return `Você foi convidado para ${workspaceName} no PipeFlow`
}
