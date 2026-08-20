/** Baked Resend template IDs for React Melbourne. Override via RESEND_TPL_* env. */

export const RESEND_TEMPLATE_IDS = {
  subscribeConfirm:
    process.env.RESEND_TPL_SUBSCRIBE_CONFIRM ||
    "cb41bf93-dacc-47ef-87d1-73f2c1694706",
  subscribeNotify:
    process.env.RESEND_TPL_SUBSCRIBE_NOTIFY ||
    "b242afb2-c398-4bba-9e1b-03f946df416d",
  talkNotify:
    process.env.RESEND_TPL_TALK_NOTIFY || "62ae89ea-ea6a-4424-b27e-d8002c0d71bf",
  talkConfirm:
    process.env.RESEND_TPL_TALK_CONFIRM || "f972249f-31b5-4aa3-83e4-229d218f869a",
  sponsorNotify:
    process.env.RESEND_TPL_SPONSOR_NOTIFY ||
    "c8374c13-361d-4b05-92cd-e84d5b30af9e",
  sponsorConfirm:
    process.env.RESEND_TPL_SPONSOR_CONFIRM ||
    "1311776a-0018-4a5a-8c97-c30f06ecae98",
} as const;
