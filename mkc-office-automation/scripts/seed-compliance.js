const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

const complianceData = [
    // Direct Taxes
    {
        category: 'DIRECT_TAX',
        particular: 'Advance Tax Payment',
        description: 'Quarterly advance tax payment',
        frequency: 'QUARTERLY',
        filing_dates: JSON.stringify({ dates: ['15th June', '15th September', '15th December', '15th March'] })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Corporate Income Tax Return (ITR-7 & ITR-6)',
        description: 'Return of Income (Form ITR-7 & Form ITR-6)',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '31st October', conditional: '30th November if transfer pricing applicable' })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Monthly TDS Deposit',
        description: 'TDS Deposit (Payment & Returns)',
        frequency: 'MONTHLY',
        filing_dates: JSON.stringify({ day: '7' })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'TDS Return Filing (24Q, 26Q, 27Q)',
        description: 'Filing of TDS Return (Salary and Non Salary)',
        frequency: 'QUARTERLY',
        filing_dates: JSON.stringify({ dates: ['31st July', '31st October', '31st January', '31st May'] })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Form 16A',
        description: 'Tax Certificate (Non-Salary)',
        frequency: 'QUARTERLY',
        filing_dates: JSON.stringify({ dates: ['15th August', '15th November', '15th February', '15th June'] })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Form 16',
        description: 'Tax Certificate (Salary)',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '15th June' })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Form 15CA/15CB',
        description: 'Certification for withdrawing taxes on foreign remittances',
        frequency: 'CUSTOM',
        filing_dates: JSON.stringify({ note: 'At the time of foreign remittance' })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Form 3CD + Tax Auditor Certificate (Form 3CB)',
        description: 'Tax Audit (applicable in case of turnover INR 1 crore)',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '30th September', conditional: '30th November if transfer pricing applicable' })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Form 3CEB',
        description: 'Transfer pricing (applicable in case of foreign related party transactions)',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '30th November' })
    },
    {
        category: 'DIRECT_TAX',
        particular: 'Form 61A',
        description: 'Specified Financial transaction',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '31st May' })
    },

    // GST - Indirect Taxes
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-1 (Details of Outward Supplies)',
        description: 'For registered persons having turnover exceeding 1.5 Crore',
        frequency: 'MONTHLY',
        filing_dates: JSON.stringify({ day: '11' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-1 (Quarterly)',
        description: 'For registered persons having turnover less than 1.5 crore',
        frequency: 'QUARTERLY',
        filing_dates: JSON.stringify({ note: 'Last day of succeeding month from the end of quarter' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-3B (Monthly Return)',
        description: 'For registered person having aggregate turnover exceeding INR 5 crore',
        frequency: 'MONTHLY',
        filing_dates: JSON.stringify({ day: '20' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-6',
        description: 'Return for Input service distributor (Form GSTR-6)',
        frequency: 'MONTHLY',
        filing_dates: JSON.stringify({ day: '13' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Annual Return - Form GSTR-9',
        description: 'GST Audit (GSTR-9C) applicable if turnover is INR 2 Crore or more',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '31st December' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-4',
        description: 'Annual Return under Composition Scheme',
        frequency: 'ANNUAL',
        filing_dates: JSON.stringify({ date: '30th April' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form CMP-08',
        description: 'Quarterly Return under Composition Scheme',
        frequency: 'QUARTERLY',
        filing_dates: JSON.stringify({ note: '18th day of succeeding month of the end of quarter' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-7 (Return of TDS)',
        description: 'Return by Registered persons who are required to deduct tax',
        frequency: 'MONTHLY',
        filing_dates: JSON.stringify({ day: '10' })
    },
    {
        category: 'INDIRECT_TAX',
        particular: 'Form GSTR-8',
        description: 'Monthly Statement by E-Commerce Operator',
        frequency: 'MONTHLY',
        filing_dates: JSON.stringify({ day: '10' })
    },
];

async function seed() {
    try {
        console.log('🌱 Seeding compliance data...');

        // Check if data already exists
        const existing = await sql`SELECT COUNT(*) as count FROM compliance_items`;
        if (existing[0].count > 0) {
            console.log(`⚠️  Database already has ${existing[0].count} compliance items`);
            console.log('   Skipping seed to avoid duplicates');
            process.exit(0);
        }

        // Insert all compliance items
        for (const item of complianceData) {
            await sql`
                INSERT INTO compliance_items (category, particular, description, frequency, filing_dates, is_active)
                VALUES (
                    ${item.category},
                    ${item.particular},
                    ${item.description},
                    ${item.frequency},
                    ${item.filing_dates},
                    1
                )
            `;
        }

        console.log(`✅ Successfully seeded ${complianceData.length} compliance items!`);
        console.log('   - 10 Direct Tax items');
        console.log('   - 9 GST items');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seed();
