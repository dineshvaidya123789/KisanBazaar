// Screen texts for the livestock module in English, Hindi and Marathi. Missing keys fall back to English.
const T = {
    en: {
        sell_title: 'Sell animals', edit_title: 'Edit listing', my_title: 'My animals', soon: 'Livestock marketplace is coming soon.',
        login_needed: 'Please log in with your mobile number to continue.', who: 'Who are you?', individual: 'Farmer', farm: 'Farm', trader: 'Trader', fpo: 'FPO / group',
        business_name: 'Farm or business name (optional)', animal: 'Animal', breed: 'Breed', choose: '-- Choose --', sex: 'Male / Female', male: 'Male', female: 'Female', mixed: 'Mixed lot',
        age: 'Age (months)', weight: 'Weight (kg, optional)', milk: 'Milk per day (litres, optional)', lactations: 'Lactations (optional)', pregnancy: 'Pregnancy (months, optional)',
        quantity: 'How many animals', price: 'Price (Rs)', price_type: 'Price is', per_animal: 'per animal', per_kg: 'per kg', per_lot: 'for the whole lot',
        purpose: 'Purpose of sale', dairy: 'Dairy', breeding: 'Breeding', rearing: 'Rearing', location: 'Where are the animals?', eartag: 'Ear tag number (optional)',
        health: 'Health note (optional)', photos: 'Photos', add_photos: 'Add photos', photo_hint: 'Up to {n} clear photos. They are made smaller automatically.',
        phone: 'Your mobile number', phone_hint: 'Not shown publicly. Buyers contact you through the platform.', farmer_name: 'Farmer name (posting for a farmer)',
        not_slaughter: 'These animals are NOT for slaughter.', terms: 'I confirm the details are true, the animals are mine to sell, and I accept the seller terms.',
        submit: 'Submit for approval', submit_admin: 'Post (admin)', save: 'Save changes', saving: 'Saving...', cancel: 'Cancel',
        done_pending: 'Submitted. It will show after approval.', done_live: 'Posted. It is live now.',
        status_pending: 'Waiting for approval', status_approved: 'Live', status_rejected: 'Rejected', status_sold: 'Sold', status_expired: 'Expired',
        reason: 'Reason', edit: 'Edit', renew: 'Renew', sold: 'Mark sold', delete: 'Delete', confirm_delete: 'Delete this listing for good?', none: 'You have no animals listed yet.',
        post_new: 'Post an animal', expires: 'Valid till', err_generic: 'Something went wrong. Please try again.',
    },
    hi: {
        sell_title: 'पशु बेचें', edit_title: 'लिस्टिंग बदलें', my_title: 'मेरे पशु', soon: 'पशु बाज़ार जल्द आ रहा है।',
        login_needed: 'आगे बढ़ने के लिए मोबाइल नंबर से लॉगिन करें।', who: 'आप कौन हैं?', individual: 'किसान', farm: 'फार्म', trader: 'व्यापारी', fpo: 'FPO / समूह',
        business_name: 'फार्म या व्यवसाय का नाम (वैकल्पिक)', animal: 'पशु', breed: 'नस्ल', choose: '-- चुनें --', sex: 'नर / मादा', male: 'नर', female: 'मादा', mixed: 'मिला-जुला लॉट',
        age: 'उम्र (महीने)', weight: 'वज़न (किलो, वैकल्पिक)', milk: 'रोज़ का दूध (लीटर, वैकल्पिक)', lactations: 'ब्यात (वैकल्पिक)', pregnancy: 'गर्भ (महीने, वैकल्पिक)',
        quantity: 'कितने पशु', price: 'कीमत (रु)', price_type: 'कीमत है', per_animal: 'प्रति पशु', per_kg: 'प्रति किलो', per_lot: 'पूरे लॉट की',
        purpose: 'बेचने का उद्देश्य', dairy: 'दूध', breeding: 'प्रजनन', rearing: 'पालन', location: 'पशु कहाँ हैं?', eartag: 'कान का टैग नंबर (वैकल्पिक)',
        health: 'स्वास्थ्य की जानकारी (वैकल्पिक)', photos: 'फोटो', add_photos: 'फोटो जोड़ें', photo_hint: 'अधिकतम {n} साफ़ फोटो। अपने आप छोटे हो जाते हैं।',
        phone: 'आपका मोबाइल नंबर', phone_hint: 'सबको नहीं दिखेगा। खरीदार प्लेटफ़ॉर्म के ज़रिए संपर्क करेंगे।', farmer_name: 'किसान का नाम (किसान की ओर से डालते समय)',
        not_slaughter: 'ये पशु कटाई के लिए नहीं हैं।', terms: 'मैं पुष्टि करता/करती हूँ कि जानकारी सही है, पशु मेरे हैं और मैं विक्रेता शर्तें मानता/मानती हूँ।',
        submit: 'मंज़ूरी के लिए भेजें', submit_admin: 'पोस्ट करें (एडमिन)', save: 'बदलाव सहेजें', saving: 'सहेज रहे हैं...', cancel: 'रद्द करें',
        done_pending: 'भेज दिया। मंज़ूरी के बाद दिखेगा।', done_live: 'पोस्ट हो गया। अब दिख रहा है।',
        status_pending: 'मंज़ूरी का इंतज़ार', status_approved: 'चालू', status_rejected: 'अस्वीकृत', status_sold: 'बिक गया', status_expired: 'समय समाप्त',
        reason: 'कारण', edit: 'बदलें', renew: 'फिर चालू करें', sold: 'बिक गया', delete: 'हटाएँ', confirm_delete: 'यह लिस्टिंग हमेशा के लिए हटाएँ?', none: 'आपने अभी कोई पशु नहीं डाला है।',
        post_new: 'पशु डालें', expires: 'तक मान्य', err_generic: 'कुछ गड़बड़ हुई। फिर कोशिश करें।',
    },
    mr: {
        sell_title: 'जनावरे विका', edit_title: 'यादी बदला', my_title: 'माझी जनावरे', soon: 'पशु बाजार लवकरच येत आहे.',
        login_needed: 'पुढे जाण्यासाठी मोबाईल नंबरने लॉगिन करा.', who: 'तुम्ही कोण?', individual: 'शेतकरी', farm: 'फार्म', trader: 'व्यापारी', fpo: 'FPO / गट',
        business_name: 'फार्म किंवा व्यवसायाचे नाव (ऐच्छिक)', animal: 'जनावर', breed: 'जात', choose: '-- निवडा --', sex: 'नर / मादी', male: 'नर', female: 'मादी', mixed: 'मिश्र लॉट',
        age: 'वय (महिने)', weight: 'वजन (किलो, ऐच्छिक)', milk: 'रोजचे दूध (लिटर, ऐच्छिक)', lactations: 'वेत (ऐच्छिक)', pregnancy: 'गाभण (महिने, ऐच्छिक)',
        quantity: 'किती जनावरे', price: 'किंमत (रु)', price_type: 'किंमत आहे', per_animal: 'प्रति जनावर', per_kg: 'प्रति किलो', per_lot: 'संपूर्ण लॉटची',
        purpose: 'विक्रीचा उद्देश', dairy: 'दूध', breeding: 'पैदास', rearing: 'संगोपन', location: 'जनावरे कुठे आहेत?', eartag: 'कानातील टॅग नंबर (ऐच्छिक)',
        health: 'आरोग्य माहिती (ऐच्छिक)', photos: 'फोटो', add_photos: 'फोटो जोडा', photo_hint: 'जास्तीत जास्त {n} स्पष्ट फोटो. ते आपोआप लहान होतात.',
        phone: 'तुमचा मोबाईल नंबर', phone_hint: 'सर्वांना दिसणार नाही. खरेदीदार प्लॅटफॉर्मद्वारे संपर्क करतील.', farmer_name: 'शेतकऱ्याचे नाव (शेतकऱ्यासाठी टाकताना)',
        not_slaughter: 'ही जनावरे कत्तलीसाठी नाहीत.', terms: 'मी खात्री देतो/देते की माहिती खरी आहे, जनावरे माझी आहेत आणि मी विक्रेता अटी मान्य करतो/करते.',
        submit: 'मंजुरीसाठी पाठवा', submit_admin: 'पोस्ट करा (अ‍ॅडमिन)', save: 'बदल जतन करा', saving: 'जतन होत आहे...', cancel: 'रद्द करा',
        done_pending: 'पाठवले. मंजुरीनंतर दिसेल.', done_live: 'पोस्ट झाले. आता दिसत आहे.',
        status_pending: 'मंजुरीची प्रतीक्षा', status_approved: 'सुरू', status_rejected: 'नाकारले', status_sold: 'विकले', status_expired: 'मुदत संपली',
        reason: 'कारण', edit: 'बदला', renew: 'पुन्हा सुरू करा', sold: 'विकले', delete: 'काढून टाका', confirm_delete: 'ही यादी कायमची काढायची?', none: 'तुम्ही अजून कोणतेही जनावर टाकलेले नाही.',
        post_new: 'जनावर टाका', expires: 'पर्यंत वैध', err_generic: 'काहीतरी चुकले. पुन्हा प्रयत्न करा.',
    },
};

export const makeT = (lang) => (key, vars) => {
    let s = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) Object.keys(vars).forEach((k) => { s = s.replace('{' + k + '}', vars[k]); });
    return s;
};
export const TEXT_LANGS = Object.keys(T);
export const TEXTS = T;
