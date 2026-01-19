const fs = require('fs');

// 1. قائمة الملفات التي تريد قراءتها
const inputFileNames = [
    'meals_dbase_1-50.js',
    'meals_dbase_51-100.js',
    'meals_dbase_101-150.js',
    'meals_dbase_151-200.js'
];

const outputFileName = 'meal_names.txt';

function extractMealNames() {
    let outputContent = "قائمة بأسماء الوجبات المستخرجة:\n";
    outputContent += "========================================\n\n";
    
    let totalCount = 0;

    for (const fileName of inputFileNames) {
        try {
            console.log(`جارٍ معالجة الملف: ${fileName}...`);

            // 2. قراءة الملف الحالي
            if (!fs.existsSync(fileName)) {
                console.warn(`⚠️ تنبيه: الملف "${fileName}" غير موجود. تم تخطيه.`);
                continue;
            }

            let rawContent = fs.readFileSync(fileName, 'utf8').trim();

            // 3. تنظيف النص (الطريقة المحسنة)
            // البحث عن بداية ونهاية المصفوفة بدقة لتجاهل أي شوائب
            let jsonStartIndex = rawContent.indexOf('[');
            let jsonEndIndex = rawContent.lastIndexOf(']');

            if (jsonStartIndex === -1 || jsonEndIndex === -1) {
                console.error(`❌ خطأ في الملف ${fileName}: لم يتم العثور على أقواس مصفوفة [] صالحة.`);
                continue;
            }

            // قص النص ليكون JSON نقي فقط
            let jsonString = rawContent.substring(jsonStartIndex, jsonEndIndex + 1);

            const meals = JSON.parse(jsonString);

            if (!Array.isArray(meals)) {
                console.error(`❌ خطأ في الملف ${fileName}: المحتوى بعد المعالجة ليس مصفوفة.`);
                continue;
            }

            // 4. استخراج الأسماء
            meals.forEach(meal => {
                // تأكد من ترتيب الأولويات (العربي أم الإنجليزي) حسب رغبتك
                const mealName = meal.name || meal.name_en || "اسم غير معروف"; 
                const mealId = meal.id || "??";
                
                outputContent += `${mealId}. ${mealName}\n`;
                totalCount++;
            });

        } catch (error) {
            console.error(`❌ حدث خطأ أثناء معالجة الملف ${fileName}:`);
            console.error(`السبب: ${error.message}`);
            // طباعة جزء من النص لفهم مكان الخطأ في الـ JSON
            // console.log(error); 
        }
    }

    // 5. الحفظ
    try {
        fs.writeFileSync(outputFileName, outputContent, 'utf8');
        console.log(`\n✅ تم الانتهاء! تم استخراج إجمالي ${totalCount} وجبة.`);
        console.log(`📂 تم الحفظ في: ${outputFileName}`);
    } catch (err) {
        console.error('حدث خطأ أثناء حفظ الملف النهائي:', err.message);
    }
}

extractMealNames();