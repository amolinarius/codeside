import fonctions from "./a-fonctions.json"
import boucles from "./b-boucles.json"
import conditions from "./c-conditions.json"

const controleSection: Section = {
    id: 1,
    title: "Blocs de contrôle",
    courses: [fonctions, boucles, conditions] as Course[]
};
export default controleSection;