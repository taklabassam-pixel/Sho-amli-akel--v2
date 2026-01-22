const fs = require('fs');

const fileList = [
    'meals_dbase_1-50.js',
    'meals_dbase_51-100.js',
    'meals_dbase_101-150.js',
    'meals_dbase_151-200.js'
];

const outputFileName = 'image_meal_names.txt';

// مسح الملف القديم للبدء بملف جديد
if (fs.existsSync(outputFileName)) {
    fs.unlinkSync(outputFileName);
}

fileList.forEach((inputFileName) => {
    try {
        if (fs.existsSync(inputFileName)) {
            let data = fs.readFileSync(inputFileName, 'utf8');

            const startBracket = data.indexOf('[');
            const endBracket = data.lastIndexOf(']') + 1;

            if (startBracket !== -1 && endBracket !== -1) {
                const jsonString = data.substring(startBracket, endBracket);

                // استخدام eval للتعامل مع أي أخطاء تنسيق بسيطة في ملفات الـ JS
                const meals = eval(jsonString);

                // استخراج اسم الصورة فقط (إزالة مسار المجلد images/)
                const imageNames = meals.map(meal => {
                    if (meal.image) {
                        // يأخذ ما بعد علامة "/" ليعطيك اسم الملف فقط
                        return meal.image.split('/').pop();
                    }
                    return 'no-image.jpg';
                }).join('\n') + '\n';

                fs.appendFileSync(outputFileName, imageNames, 'utf8');

                console.log(`✅ تم استخراج صور ${meals.length} وجبة من [${inputFileName}]`);
            }
        }
    } catch (err) {
        console.error(`❌ خطأ في ${inputFileName}:`, err.message);
    }
});

console.log(`\n✨ انتهى! قائمة الصور جاهزة في: ${outputFileName}`);