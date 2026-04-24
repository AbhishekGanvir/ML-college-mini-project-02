import re

# ==============================
# CLEAN TEXT
# ==============================
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z ]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# ==============================
# RISK DETECTION
# ==============================
danger_words = [
    "sugar", "added sugar", "high fructose corn syrup",
    "palm oil", "refined oil", "hydrogenated",
    "preservatives", "artificial", "flavour enhancer",
    "sodium", "salt", "msg"
]

def detect_risk(text):
    text = text.lower()
    return [w for w in danger_words if w in text]


# ==============================
# ALLERGEN DETECTION
# ==============================
def detect_allergens(text):
    allergens = {
        "milk": ["milk", "lactose", "butter", "cheese"],
        "nuts": ["nuts", "almond", "cashew", "peanut", "walnut"],
        "gluten": ["wheat", "gluten", "barley"],
        "soy": ["soy"],
        "egg": ["egg"],
        "fish": ["fish"],
        "shellfish": ["shrimp", "crab", "lobster"]
    }

    found = []
    text = text.lower()

    for key, values in allergens.items():
        if any(v in text for v in values):
            found.append(key)

    return found


# ==============================
# USAGE LOGIC
# ==============================
def usage_recommendation(grade):
    mapping = {
        "A": ("Safe daily", "Low impact"),
        "B": ("Moderate daily", "Mild impact"),
        "C": ("Limit (2-3/week)", "Moderate impact"),
        "D": ("Rare consumption", "High impact"),
        "E": ("Avoid", "Very high impact")
    }
    return mapping.get(grade, ("Unknown", "Unknown"))


# ==============================
# PERSONALIZATION
# ==============================
def personalized_advice(text, allergens, conditions):
    advice = []

    if not conditions:
        return advice

    text = text.lower()

    if "diabetes" in conditions and "sugar" in text:
        advice.append("Avoid high sugar due to diabetes")

    if "lactose_intolerance" in conditions and "milk" in allergens:
        advice.append("Contains lactose, avoid this product")

    if "heart" in conditions and "oil" in text:
        advice.append("High oil content may affect heart health")

    return advice


# ==============================
# RECOMMENDATIONS
# ==============================
def generate_recommendations(risks, allergens, grade, conditions):
    recs = {
        "overall": "",
        "dietary": [],
        "lifestyle": [],
        "alternatives": []
    }

    # =========================
    # OVERALL SUMMARY
    # =========================
    if grade == "A":
        recs["overall"] = "This is a healthy food option suitable for regular consumption."
    elif grade == "B":
        recs["overall"] = "Generally safe, but consume in moderation."
    elif grade == "C":
        recs["overall"] = "Moderate health impact. Avoid frequent consumption."
    elif grade == "D":
        recs["overall"] = "Not recommended regularly. Limit intake."
    else:
        recs["overall"] = "Highly unhealthy. Avoid consumption."

    # =========================
    # DIETARY SUGGESTIONS
    # =========================
    if "sugar" in risks:
        recs["dietary"].append("Reduce sugar intake to maintain healthy blood levels")
        recs["alternatives"].append("Use jaggery or natural sweeteners")

    if "sodium" in risks or "salt" in risks:
        recs["dietary"].append("Limit sodium intake to control blood pressure")
        recs["alternatives"].append("Use low-sodium alternatives")

    if "palm oil" in risks or "refined oil" in risks:
        recs["dietary"].append("Avoid processed oils for better heart health")
        recs["alternatives"].append("Switch to olive oil or cold-pressed oils")

    # =========================
    # ALLERGEN BASED
    # =========================
    if "milk" in allergens:
        recs["dietary"].append("Avoid dairy if lactose intolerant")
        recs["alternatives"].append("Try almond or soy milk")

    if "gluten" in allergens:
        recs["dietary"].append("Avoid gluten if sensitive")
        recs["alternatives"].append("Try gluten-free grains like rice or oats")

    if "nuts" in allergens:
        recs["dietary"].append("Avoid nuts if allergic")
    
    # =========================
    # CONDITION BASED
    # =========================
    if "diabetes" in conditions and "sugar" in risks:
        recs["lifestyle"].append("Monitor sugar intake strictly due to diabetes")

    if "heart" in conditions and "oil" in risks:
        recs["lifestyle"].append("Limit oily foods to maintain heart health")

    if "lactose_intolerance" in conditions and "milk" in allergens:
        recs["lifestyle"].append("Avoid lactose-based products completely")

    # =========================
    # DEFAULT CASE
    # =========================
    if not recs["dietary"]:
        recs["dietary"].append("Food is relatively safe if consumed in moderation")

    return recs