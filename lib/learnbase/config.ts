import "server-only"

const apiBaseUrl = process.env.LEARNBASE_API_BASE_URL
const apiKey = process.env.LEARNBASE_API_KEY
const tenantSlug = process.env.LEARNBASE_TENANT_SLUG

if (!apiBaseUrl) {
  throw new Error("Missing LEARNBASE_API_BASE_URL")
}

if (!apiKey) {
  throw new Error("Missing LEARNBASE_API_KEY")
}

if (!tenantSlug) {
  throw new Error("Missing LEARNBASE_TENANT_SLUG")
}

export const learnbaseConfig = {
  apiBaseUrl,
  apiKey,
  tenantSlug,
}
