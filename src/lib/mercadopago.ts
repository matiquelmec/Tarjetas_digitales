import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize MercadoPago only if access token is available
export const mercadopago = process.env.MP_ACCESS_TOKEN 
  ? new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN 
    })
  : null;

export const PLAN_PRICES = {
  FREE: 0,
  PROFESSIONAL: 9990, // $9.990 CLP (aprox $12.99 USD)
  BUSINESS: 29990,    // $29.990 CLP (aprox $39.99 USD)
  ENTERPRISE: 149990, // $149.990 CLP (aprox $199 USD)
};

export const PLAN_LIMITS = {
  FREE: { maxCards: 1 },
  PROFESSIONAL: { maxCards: 5 },
  BUSINESS: { maxCards: 25 },
  ENTERPRISE: { maxCards: -1 }, // -1 means unlimited
};

export const PLAN_DETAILS = {
  PROFESSIONAL: {
    name: 'Plan Profesional',
    description: '5 tarjetas activas, plantillas premium, sin marca de agua, analytics avanzados',
    price: PLAN_PRICES.PROFESSIONAL,
  },
  BUSINESS: {
    name: 'Plan Business',
    description: '25 tarjetas activas, equipo hasta 10 usuarios, API access, integraciones CRM',
    price: PLAN_PRICES.BUSINESS,
  },
  ENTERPRISE: {
    name: 'Plan Enterprise',
    description: 'Tarjetas ilimitadas, usuarios ilimitados, white-label completo, soporte dedicado',
    price: PLAN_PRICES.ENTERPRISE,
  },
};