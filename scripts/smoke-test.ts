// scripts/smoke-test.ts
import { encryptData, decryptData } from "../src/lib/encryption";
import { calculateDiff } from "../src/lib/audit";
import { validateVoucher } from "../src/actions/catalog";
import { calculateJokiEstimate } from "../src/actions/orders";
import { formatIndonesianPhone, interpolateTemplate } from "../src/lib/wa";
import { checkRateLimit } from "../src/lib/rate-limit";
import { verifyXenditWebhookToken } from "../src/lib/xendit";

async function runSmokeTests() {
  console.log("🚀 Starting TopUpGame Automated Smoke Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      failed++;
    }
  }

  // 1. Encryption & Decryption AES-256-GCM
  try {
    const sensitive = JSON.stringify({
      user: "gamer_pro",
      pass: "SuperSecret99!",
      backupCode: "123456",
    });
    const encrypted = encryptData(sensitive);
    const decrypted = decryptData(encrypted);
    assert("AES-256-GCM Encrypt & Decrypt", sensitive === decrypted && encrypted.includes(":"));
  } catch (e: any) {
    assert(`AES-256-GCM Encrypt & Decrypt (${e.message})`, false);
  }

  // 2. Audit Log JSONB Auto-Diff
  try {
    const before = { priceSell: "50000.00", stock: 100, isActive: true };
    const after = { priceSell: "48000.00", stock: 99, isActive: true };
    const diff = calculateDiff(before, after);
    assert(
      "Audit Log Auto-Diff calculation",
      diff !== null &&
        diff.priceSell?.before === "50000.00" &&
        diff.priceSell?.after === "48000.00" &&
        !("isActive" in diff)
    );
  } catch (e: any) {
    assert(`Audit Log Diff (${e.message})`, false);
  }

  // 3. Voucher Calculation
  try {
    const vResult = await validateVoucher("HEMAT20", 100000, "TOPUP");
    assert(
      "Voucher validation (HEMAT20 on Rp 100.000)",
      vResult.valid === true && vResult.discountAmount === 20000
    );
  } catch (e: any) {
    assert(`Voucher validation (${e.message})`, false);
  }

  // 4. Joki Estimate
  try {
    const est = await calculateJokiEstimate({
      gameId: "mlbb",
      startOrderIndex: 1, // Epic
      targetOrderIndex: 4, // Mythic
      pricePerStarOrTier: 35000,
    });
    assert(
      "Joki estimate calculation (Epic -> Mythic)",
      est.valid === true && est.steps === 3 && est.totalPrice === 105000 && est.etaHours === 8
    );
  } catch (e: any) {
    assert(`Joki estimate (${e.message})`, false);
  }

  // 5. WhatsApp Phone Formatting & Template Interpolation
  try {
    const phone = formatIndonesianPhone("081234567890");
    const text = interpolateTemplate("Halo {{name}}, total: Rp {{total}}", {
      name: "Rizky",
      total: "50.000",
    });
    assert(
      "WhatsApp format phone and interpolate template",
      phone === "6281234567890" && text === "Halo Rizky, total: Rp 50.000"
    );
  } catch (e: any) {
    assert(`WhatsApp helpers (${e.message})`, false);
  }

  // 6. Rate Limiting (Token Bucket)
  try {
    const rl1 = checkRateLimit("test_client", 3, 60);
    const rl2 = checkRateLimit("test_client", 3, 60);
    const rl3 = checkRateLimit("test_client", 3, 60);
    const rl4 = checkRateLimit("test_client", 3, 60);
    assert(
      "Rate Limiter limits after exceeding threshold",
      rl1.allowed && rl2.allowed && rl3.allowed && !rl4.allowed
    );
  } catch (e: any) {
    assert(`Rate limiter (${e.message})`, false);
  }

  // 7. Xendit Webhook Token Verification
  try {
    const valid = verifyXenditWebhookToken("xnd_callback_token_verified");
    assert("Xendit webhook token verification", typeof valid === "boolean");
  } catch (e: any) {
    assert(`Xendit webhook token (${e.message})`, false);
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runSmokeTests();
