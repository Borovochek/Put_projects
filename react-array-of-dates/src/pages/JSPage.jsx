import { DatesCard } from "../components/js-cards/DatesCard.jsx";
import { ArrayCard } from "../components/js-cards/ArrayCard.jsx";
import '../css/JSPage.css';

export const JSPage = () =>  {
    return (
        <div  className="app-container">
            < DatesCard />
            
            < ArrayCard />
        </div>
    );
}
