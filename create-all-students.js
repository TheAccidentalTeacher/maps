// Batch Create All Student Accounts - Run Once
// This will create all 39 students in Supabase automatically
// Date: October 20, 2025

// INSTRUCTIONS:
// 1. Open index.html
// 2. Open browser console (F12)
// 3. Copy this entire script
// 4. Paste in console and press Enter
// 5. All 39 students will be created automatically!

// Student data from Excel spreadsheet
const students = [
  {firstName: "Kalaya", lastName: "Boston", username: "kalayabo", password: "kinddoor79"},
  {firstName: "Kisu", lastName: "Boston", username: "kisubo", password: "lowdesk32"},
  {firstName: "Sayna", lastName: "Cummings", username: "saynacu", password: "slowbrass50"},
  {firstName: "Helena", lastName: "Debler", username: "helenade", password: "quietchess79"},
  {firstName: "Jack", lastName: "Dempsey", username: "jackde", password: "coldbun88"},
  {firstName: "Norma", lastName: "Harris", username: "normaha", password: "nicearm91"},
  {firstName: "Ashton", lastName: "Jackson", username: "ashtonja", password: "roundfish98"},
  {firstName: "Gabriel", lastName: "Jangala", username: "gabrielja", password: "shorttiger61"},
  {firstName: "Grace", lastName: "Kinzer", username: "graceki", password: "cleanmouse13"},
  {firstName: "Easton", lastName: "Kvamme", username: "eastonkv", password: "messyleaf92"},
  {firstName: "Alayna", lastName: "MacDonald", username: "alaynama", password: "redtoy18"},
  {firstName: "Leslie", lastName: "Pete", username: "lesliepe", password: "orangebed97"},
  {firstName: "Sawyer", lastName: "Roslansky", username: "sawyerro", password: "quickmass67"},
  {firstName: "Skyler", lastName: "Sandson", username: "syklersa", password: "freelunch34"},
  {firstName: "Oscar", lastName: "Winishut", username: "oscarwi", password: "greenclass23"},
  {firstName: "River", lastName: "Bengtson", username: "riverbe", password: "graykite80"},
  {firstName: "Alvaro", lastName: "Christoffersen", username: "alvaroch", password: "tallplot45"},
  {firstName: "John", lastName: "Coulter", username: "johnco", password: "greendime66"},
  {firstName: "Joslynn", lastName: "Douglas", username: "joslynndo", password: "lowmall16"},
  {firstName: "Casey", lastName: "Fields", username: "caseyfi", password: "sadflock87"},
  {firstName: "Adam", lastName: "Jackson", username: "adamja", password: "bigsock27"},
  {firstName: "Tianna", lastName: "Kvamme", username: "tiannakv", password: "olivepaint36"},
  {firstName: "Brooke", lastName: "Lambert", username: "brookela", password: "richhair51"},
  {firstName: "Tovey", lastName: "Malone-Crain", username: "toveyma", password: "lowplot64"},
  {firstName: "Justus", lastName: "McConkey", username: "justusmc", password: "graybook35"},
  {firstName: "Wyatt", lastName: "McGinnis", username: "wyattmc", password: "roundbunny75"},
  {firstName: "Abigail", lastName: "Meyer", username: "abigailme", password: "oddstar62"},
  {firstName: "Maison", lastName: "Oosterman", username: "maisonoo", password: "reddeer93"},
  {firstName: "Ryland", lastName: "Paul", username: "rylandpa", password: "funbun92"},
  {firstName: "E. Jay", lastName: "Thompson", username: "ejayth", password: "Hodges35"},
  {firstName: "Lucius", lastName: "Townsend", username: "luciusto", password: "proudhair96"},
  {firstName: "Alayah", lastName: "Voyles", username: "alayahvo", password: "youngbunny90"},
  {firstName: "Natalia", lastName: "White", username: "nataliawh", password: "redbun33"},
  {firstName: "Hadassah", lastName: "Alexander", username: "hadassahal", password: "drycup40"},
  {firstName: "Naomi", lastName: "Jackson", username: "naomija", password: "widekite15"},
  {firstName: "Autumn", lastName: "Riley", username: "ariley", password: "hottooth90"},
  {firstName: "Raylee", lastName: "Rock-Albert", username: "rayleero", password: "younghorse54"},
  {firstName: "Eastyn", lastName: "Shipman", username: "eastynsh", password: "megaamber19"},
  {firstName: "Hunter", lastName: "Stickwan", username: "hunterst", password: "orangekite70"}
];

// Batch create all students
async function createAllStudents() {
  console.log('🚀 Starting batch student creation...');
  console.log(`📊 Total students to create: ${students.length}`);
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const email = `${student.username}@mrsomers.student`; // Using fake domain for students
    
    console.log(`\n[${i+1}/${students.length}] Creating: ${student.firstName} ${student.lastName}`);
    
    try {
      // Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: student.password,
        options: {
          data: {
            full_name: `${student.firstName} ${student.lastName}`,
            account_type: 'student',
            username: student.username,
            first_name: student.firstName,
            last_name: student.lastName
          }
        }
      });
      
      if (error) {
        // Check if user already exists
        if (error.message.includes('already registered')) {
          console.log(`⏭️  Skipped: ${student.firstName} ${student.lastName} (already exists)`);
          results.skipped.push(student);
        } else {
          console.error(`❌ Failed: ${student.firstName} ${student.lastName}`, error.message);
          results.failed.push({student, error: error.message});
        }
      } else {
        console.log(`✅ Created: ${student.firstName} ${student.lastName}`);
        results.success.push(student);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
    } catch (err) {
      console.error(`❌ Exception: ${student.firstName} ${student.lastName}`, err);
      results.failed.push({student, error: err.message});
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH CREATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully created: ${results.success.length}`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('='.repeat(60));
  
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED STUDENTS:');
    results.failed.forEach(({student, error}) => {
      console.log(`  - ${student.firstName} ${student.lastName}: ${error}`);
    });
  }
  
  if (results.success.length > 0) {
    console.log('\n✅ SUCCESSFULLY CREATED:');
    results.success.forEach(student => {
      console.log(`  - ${student.firstName} ${student.lastName} (${student.username})`);
    });
  }
  
  console.log('\n🎉 Batch creation complete!');
  
  return results;
}

// Auto-run the function
console.log('🎯 Ready to create all 39 students!');
console.log('⚠️  This will create student accounts with usernames like: kalayabo@mrsomers.student');
console.log('\n📝 To start, run: createAllStudents()');
console.log('\nOr press Enter to auto-start in 3 seconds...');

// Auto-start after 3 seconds
setTimeout(() => {
  console.log('\n🚀 Auto-starting batch creation...\n');
  createAllStudents();
}, 3000);
