// Comprehensive Database of MP Districts and Tehsils
// Source of Truth for Location Filtering

export const mpLocations = {
    "Indore": {
        label: "Indore (इन्दौर)",
        tehsils: ["Indore City", "Dr. Ambedkar Nagar (Mhow)", "Sanwer", "Depalpur", "Hatod"]
    },
    "Bhopal": {
        label: "Bhopal (भोपाल)",
        tehsils: ["Huzur", "Berasia", "Kolar"]
    },
    "Ujjain": {
        label: "Ujjain (उज्जैन)",
        tehsils: ["Ujjain City", "Nagda", "Badnagar", "Mahidpur", "Tarana", "Ghatiya", "Khachrod"]
    },
    "Dewas": {
        label: "Dewas (देवास)",
        tehsils: ["Dewas City", "Sonkatch", "Bagli", "Kannod", "Tonkhurd", "Khategaon"]
    },
    "Ratlam": {
        label: "Ratlam (रतलाम)",
        tehsils: ["Ratlam City", "Jaora", "Alot", "Sailana", "Bajna", "Piploda"]
    },
    "Mandsaur": {
        label: "Mandsaur (मंदसौर)",
        tehsils: ["Mandsaur City", "Malhargarh", "Garoth", "Shamgarh", "Daloda", "Bhanpura"]
    },
    "Sehore": {
        label: "Sehore (सीहोर)",
        tehsils: ["Sehore City", "Ashta", "Ichhawar", "Budhni", "Nasrullaganj"]
    },
    "Vidisha": {
        label: "Vidisha (विदिशा)",
        tehsils: ["Vidisha City", "Basoda", "Sironj", "Kurwai", "Lateri"]
    },
    "Sagar": {
        label: "Sagar (सागर)",
        tehsils: ["Sagar City", "Khurai", "Bina", "Rahatgarh", "Deori"]
    },
    "Satna": {
        label: "Satna (सतना)",
        tehsils: ["Satna City", "Maihar", "Nagod", "Amarpatan", "Rampur Baghelan"]
    },
    "Jabalpur": {
        label: "Jabalpur (जबलपुर)",
        tehsils: ["Jabalpur", "Sihora", "Patan", "Panagar", "Kundam"]
    },
    "Gwalior": {
        label: "Gwalior (ग्वालियर)",
        tehsils: ["Gwalior", "Dabra", "Bhitarwar", "Chinqe"]
    },
    "Khargone": {
        label: "Khargone (खरगोन)",
        tehsils: ["Khargone", "Maheshwar", "Barwaha", "Segaon", "Bhikangaon"]
    },
    "Khandwa": {
        label: "Khandwa (खंडवा)",
        tehsils: ["Khandwa", "Pandhana", "Punasa", "Harsud"]
    },
    "Dhar": {
        label: "Dhar (धार)",
        tehsils: ["Dhar", "Badnawar", "Sardarpur", "Manawar", "Kukshi", "Dharampuri"]
    },
    "Raisen": {
        label: "Raisen (रायसेन)",
        tehsils: ["Raisen", "Goharganj", "Begamganj", "Gairatganj", "Silwani"]
    },
    "Rajgarh": {
        label: "Rajgarh (राजगढ़)",
        tehsils: ["Rajgarh", "Biaora", "Narsinghgarh", "Sarangpur", "Khilchipur"]
    },
    "Hoshangabad": {
        label: "Hoshangabad (होशंगाबाद)",
        tehsils: ["Hoshangabad", "Itarsi", "Pipariya", "Sohagpur", "Babai"]
    },
    "Betul": {
        label: "Betul (बैतूल)",
        tehsils: ["Betul", "Multai", "Amla", "Bhainsdehi", "Shahpur"]
    },
    "Morena": {
        label: "Morena (मुरैना)",
        tehsils: ["Morena", "Ambah", "Porsa", "Joura", "Sabalgarh"]
    },
    "Burhanpur": {
        label: "Burhanpur (बुरहानपुर)",
        tehsils: ["Burhanpur", "Khaknar", "Nepanagar"]
    }
};

// Helper: Get list of districts (keys) sorted alphabetically
export const getDistricts = () => {
    return Object.keys(mpLocations).sort((a, b) => a.localeCompare(b));
};

// Helper: Get display label for a district
export const getDistrictLabel = (district) => mpLocations[district]?.label || district;

// Helper: Get tehsils for a district sorted alphabetically
export const getTehsils = (district) => {
    const tehsils = mpLocations[district]?.tehsils || [];
    return [...tehsils].sort((a, b) => a.localeCompare(b));
};
