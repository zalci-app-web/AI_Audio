const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '..', '.env.local');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n=== Stripe API Key Setup ===\n');
console.log('Stripeのダッシュボードから "Secret Key" (sk_test_... または sk_live_... で始まるキー) を取得して入力してください。');
console.log('キーが不明な場合は、空のままEnterを押すとスキップします。\n');

rl.question('Stripe Secret Key: ', (key) => {
    if (!key.trim()) {
        console.log('スキップしました。');
        rl.close();
        return;
    }

    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // 更新または追加
    if (envContent.includes('STRIPE_SECRET_KEY=')) {
        envContent = envContent.replace(/STRIPE_SECRET_KEY=.*/g, `STRIPE_SECRET_KEY=${key.trim()}`);
    } else {
        envContent += `\nSTRIPE_SECRET_KEY=${key.trim()}\n`;
    }

    // サイトURLがなければ追加（ローカル開発用）
    if (!envContent.includes('NEXT_PUBLIC_SITE_URL=')) {
        envContent += `\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env.local を更新しました！');
    console.log('変更を反映するには、サーバーを再起動してください (npm run dev を一度止めてから再実行)。');

    rl.close();
});
