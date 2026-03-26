import campusMapImg from '@/assets/campus-map.jpg';

const CampusMap = () => (
  <div className="bg-card rounded-xl border overflow-hidden">
    <div className="p-4 border-b">
      <h3 className="font-heading font-semibold text-card-foreground">Campus Parking Map</h3>
    </div>
    <img src={campusMapImg} alt="Campus parking zones map" className="w-full" loading="lazy" width={1200} height={800} />
  </div>
);

export default CampusMap;
