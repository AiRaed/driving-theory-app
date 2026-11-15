/**
 * Curated UK driving-theory vocabulary for Keyword Card drafts.
 * One canonical term per concept. Aliases are inflections and official
 * names for that same concept, not loose topic tags.
 * Explanations define the word. Figures appear only where the official
 * question bank states them. Arabic is left empty for a later phase.
 */

import type { EditorialPattern, KeywordDraftPriority, LexiconEntry } from './draftTypes';

function e(
  term_en: string,
  aliases: string[],
  explanation_en: string,
  priority: KeywordDraftPriority,
  image_concept: string | null,
  extra?: Partial<
    Pick<
      LexiconEntry,
      | 'example_en'
      | 'review_flag'
      | 'review_note'
      | 'review_concern'
      | 'previous_explanation_en'
      | 'label_origin'
      | 'watch_coverage'
    >
  >
): LexiconEntry {
  return {
    term_en,
    aliases,
    explanation_en,
    priority,
    image_concept,
    label_origin: 'source_term',
    ...extra,
  };
}

export const KEYWORD_LEXICON: LexiconEntry[] = [
  e(
    'Motorway',
    ['motorway', 'motorways'],
    'A major road for fast traffic, joined by slip roads, with its own signs, studs and a hard shoulder or emergency areas. Not every kind of vehicle is allowed on it.',
    'high',
    'A motorway cross-section showing lanes, the hard shoulder and a slip road.',
    { watch_coverage: true, example_en: 'You join the motorway from a slip road and match the speed of traffic already there.' }
  ),
  e(
    'Dual carriageway',
    ['dual carriageway', 'dual carriageways'],
    'A road where traffic in opposite directions is separated by a central reservation. Each side may have more than one lane.',
    'high',
    'A dual carriageway with a central reservation and two lanes each way.',
    { example_en: 'Before you turn right onto a dual carriageway, check that the central reservation can shelter your vehicle.' }
  ),
  e(
    'Single carriageway',
    ['single carriageway', 'single carriageways'],
    'A road with no central reservation between the two directions of traffic.',
    'high',
    'A single carriageway with opposing traffic separated only by a centre line.'
  ),
  e(
    'Carriageway',
    ['carriageway', 'carriageways'],
    'The part of the road that vehicles travel on, not the pavement or the verge.',
    'high',
    'A labelled road showing the carriageway, pavement and verge.'
  ),
  e(
    'Hard shoulder',
    ['hard shoulder', 'hard shoulders'],
    'The surfaced strip along the left edge of a motorway. Use it for an emergency or a breakdown, not for a rest or a phone call. On some motorways it can be opened as a running lane when a mandatory speed limit is displayed above it. A red cross above it means it is not open as a running lane.',
    'high',
    'A motorway hard shoulder beside a solid white line, with a gantry that can show either a red cross or a mandatory speed limit above it.',
    { example_en: 'If you break down, you may use the hard shoulder. Do not use it for a rest or a phone call.' }
  ),
  e(
    'Slip road',
    ['slip road', 'slip roads'],
    'A short road for joining or leaving a motorway. Give way to traffic already on the motorway, match its speed, and filter into a safe gap.',
    'high',
    'A vehicle on a slip road merging into the left-hand lane of a motorway.'
  ),
  e(
    'Central reservation',
    ['central reservation', 'central reservations'],
    'The strip that separates the two directions on a dual carriageway or motorway. If it is not deep enough to protect your vehicle, treat both sides as one road.',
    'high',
    'A central reservation between the two carriageways of a dual carriageway.'
  ),
  e(
    'Emergency area',
    ['emergency area', 'emergency areas'],
    'A signed bay off the motorway where you can stop in an emergency. Use the emergency telephone and follow the advice before you rejoin.',
    'high',
    'A blue emergency-area sign and a bay set back from the motorway lanes.'
  ),
  e(
    'Service area',
    ['service area', 'service areas'],
    'A place off a motorway where you can stop, rest and refuel. Leave the motorway and use one if you feel sleepy. Do not rest on the hard shoulder.',
    'medium',
    null
  ),
  e(
    'Contraflow',
    ['contraflow', 'contraflow system'],
    'A temporary layout, often at roadworks, where traffic is directed onto the opposite carriageway and passes oncoming vehicles without the usual barrier.',
    'high',
    'A motorway contraflow with cones and traffic passing in both directions on one carriageway.',
    { example_en: 'In a contraflow, keep your distance and do not change lanes.' }
  ),
  e(
    'Crawler lane',
    ['crawler lane', 'climbing lane', 'crawler or climbing lane'],
    'An extra lane on a steep uphill stretch for slow vehicles, so faster traffic can pass. Also called a climbing lane.',
    'high',
    'A steep motorway hill with an extra left lane for slow lorries.',
    { review_note: 'Crawler lane and climbing lane are treated as one concept because the official question uses them together.' }
  ),
  e(
    'Single-track road',
    ['single-track road', 'single-track'],
    'A narrow road, often wide enough for only one vehicle, with passing places so opposing drivers can get past each other.',
    'high',
    'A narrow country road with a passing place on one side.'
  ),
  e(
    'Passing place',
    ['passing place', 'passing places'],
    'A widened space on a single-track road. If it is on your right, wait opposite it. Do not drive onto the verge to pass.',
    'high',
    'Two vehicles using a passing place on a single-track road.'
  ),
  e(
    'Built-up area',
    ['built-up area', 'built-up'],
    'An area with buildings, such as a town or village. Some rules are stricter there, including when you may use the horn at night.',
    'high',
    null
  ),
  e(
    'Lay-by',
    ['lay-by', 'lay-bys'],
    'A space at the side of a road where vehicles can pull in and stop, off the main flow of traffic.',
    'medium',
    'A lay-by beside a main road, separated from the carriageway.'
  ),
  e(
    'Verge',
    ['verge', 'verges'],
    'The strip of ground beside the carriageway. Do not drive onto it to let another vehicle pass; there may be a hidden hazard.',
    'medium',
    'A grass verge beside the edge of a country road.'
  ),
  e(
    'Kerb',
    ['kerb', 'kerbs'],
    'The raised edge between the road and the pavement. A long vehicle may swing out before a turn so its rear wheels clear the kerb.',
    'medium',
    'A kerb between the road and the pavement, with a long vehicle swinging wide.'
  ),
  e(
    'Pavement',
    ['pavement', 'pavements'],
    'The path for pedestrians beside the road. Where there is no pavement, people may be walking in the road.',
    'medium',
    'A pavement beside a road, and a stretch with no pavement where people walk in the road.'
  ),
  e(
    'Tunnel',
    ['tunnel', 'tunnels'],
    'An enclosed stretch of road. Keep a safe gap even in slow traffic, so you have room if the vehicle in front stops.',
    'medium',
    'Vehicles keeping a gap inside a road tunnel.'
  ),
  e(
    'Hump bridge',
    ['hump bridge', 'hump bridges'],
    'A bridge with a sharp rise in the middle. It is often narrow, so you may not be able to pass an oncoming vehicle, and there may be no footpath.',
    'high',
    'A narrow hump bridge with a vehicle approaching from the other side.'
  ),
  e(
    'Quayside',
    ['quayside', 'quayside or river bank'],
    'The edge of a road beside water. The surface may be wet and slippery, the drop may be steep, and there may be no barrier.',
    'high',
    'A warning sign and a road running along an unfenced river edge.'
  ),
  e(
    'Ford',
    ['ford'],
    'A shallow place where the road runs through a stream. Cross slowly in a low gear, then test the brakes once you are clear, because water can make them less effective.',
    'high',
    'A car crossing a shallow ford slowly.'
  ),
  e(
    'Primary route',
    ['primary route', 'primary routes'],
    'A main through route, usually an A road. In England and Wales, traffic officers work on motorways and some of these routes.',
    'medium',
    null
  ),
  e(
    'One-way street',
    ['one-way street', 'one-way'],
    'A street where all traffic travels in the same direction. To turn right, position in the right-hand lane so others can pass on your left.',
    'high',
    'A one-way street with two lanes and a vehicle positioned in the right lane to turn right.'
  ),
  e(
    'T-junction',
    ['T-junction', 'T-junctions'],
    'A junction where a side road meets a through road and ends, forming the shape of a T.',
    'high',
    'A T-junction warning sign and a simple diagram of the junction.'
  ),
  e(
    'Crossroads',
    ['crossroads'],
    'A junction where two roads cross.',
    'high',
    'A simple diagram of a crossroads.'
  ),
  e(
    'Staggered junction',
    ['staggered junction', 'staggered'],
    'A junction where the side roads are not directly opposite each other. Traffic may turn or pull out on either side.',
    'high',
    'A diagram of a staggered junction, with the side roads offset.'
  ),
  e(
    'Unmarked junction',
    ['unmarked crossroads', 'unmarked junction'],
    'A junction or crossroads with no signs or lines showing who goes first. Slow down and look both ways. Hedges, walls or parked vehicles may hide the view.',
    'high',
    'An unmarked crossroads with hedges restricting the view.'
  ),
  e(
    'Roundabout',
    ['roundabout', 'roundabouts'],
    'A junction where traffic goes around a central island.',
    'high',
    'A roundabout with traffic circulating around a central island.',
    { watch_coverage: true }
  ),
  e(
    'Mini-roundabout',
    ['mini-roundabout', 'mini-roundabouts'],
    'A small roundabout, often only a painted circle. There is little room, so a long vehicle may swing wide.',
    'high',
    'A painted mini-roundabout with a long vehicle taking a wide path.'
  ),
  e(
    'Junction',
    ['junction', 'junctions'],
    'A place where roads meet or cross. Look early for vehicles, cyclists and pedestrians, because views are often restricted.',
    'medium',
    null,
    { watch_coverage: true }
  ),
  e(
    'Level crossing',
    ['level crossing', 'level crossings'],
    'A place where a railway crosses the road. A steady amber light comes on first, then flashing red lights, and you must stop. If you break down on the crossing, get everyone clear and use the railway telephone.',
    'high',
    'A level crossing with amber then flashing red lights and a barrier.',
    { example_en: 'The amber light comes on as you approach. Stop before the barrier unless you have already crossed the line.' }
  ),
  e(
    'Box junction',
    ['box junction', 'box junctions', 'yellow box junction', 'yellow box'],
    'A yellow criss-cross box at a junction, painted so the junction does not become blocked. Do not enter unless your exit is clear. You may wait in the box to turn right if your exit is clear but oncoming traffic, or other vehicles waiting to turn right, stops you turning.',
    'high',
    'A yellow box junction, with a car waiting inside only because it is turning right and its exit is clear.',
    { example_en: 'The exit road is full, so you wait before the yellow box instead of driving into it.' }
  ),
  e(
    'Bus lane',
    ['bus lane', 'bus lanes'],
    'A lane reserved for buses, and sometimes cycles, taxis or motorcycles, at the times shown on the sign. If no times are shown, it operates all day and night.',
    'high',
    'A bus-lane sign and a lane marked on the left of the road.'
  ),
  e(
    'With-flow lane',
    ['with-flow bus and cycle lane', 'with-flow cycle lane', 'with-flow'],
    'A lane that travels in the same direction as the traffic beside it. It may be for cycles, or for buses and cycles. They may pass you on the left.',
    'high',
    'A with-flow lane on the left, travelling the same way as the other lanes.'
  ),
  e(
    'Cycle lane',
    ['cycle lane', 'cycle lanes'],
    'A lane marked for cyclists. Read the signs for when it operates and which other vehicles, if any, may use it.',
    'high',
    'A cycle lane marked along the side of a road.'
  ),
  e(
    'Advanced stop line',
    ['advanced stop line', 'advanced stop lines'],
    'A box with two stop lines at traffic lights so cyclists can wait ahead of other traffic. When the lights are red, stop at the first line.',
    'high',
    'Traffic lights with two stop lines and a cyclist waiting in the box between them.'
  ),
  e(
    'Bus stop',
    ['bus stop', 'bus stops'],
    'A marked place where a bus stops for passengers. Do not park where you would block the bus or people getting on and off.',
    'low',
    'A bus stop marking at the side of the road.'
  ),
  e(
    'Tram',
    ['tram', 'trams', 'tram rails'],
    'A passenger vehicle that runs on rails set into the road. The rails are narrow and slippery. Cyclists are especially at risk of a wheel becoming stuck or sliding.',
    'high',
    'Tram rails set into a street, with a cyclist near the rails.'
  ),
  e(
    'Diamond-shaped sign',
    ['diamond-shaped', 'diamond-shaped traffic signs'],
    'A sign in a diamond shape. In these questions it gives instructions to tram drivers. Other drivers should still understand it so they can anticipate the tram.',
    'high',
    'A diamond-shaped tram sign beside tram tracks.'
  ),
  e(
    'Roadworks',
    ['roadworks', 'road works'],
    'A place where the road is being repaired. Expect a lower speed limit, cones, narrow lanes, or a contraflow.',
    'medium',
    'Motorway roadworks with cones and a reduced speed limit in a red circle.'
  ),
  e(
    'Diversion',
    ['diversion', 'diversion route'],
    'A temporary route around a closure. Follow the symbol on the yellow signs. That symbol may be a black triangle, square, circle or diamond.',
    'medium',
    'A yellow diversion sign with a black symbol.'
  ),
  e(
    'Traffic calming',
    ['traffic calming', 'traffic-calming', 'traffic-calming measures'],
    'Features such as road humps, chicanes and narrowings, used to slow traffic and protect people.',
    'high',
    'A street with a road hump, a chicane and a narrowing.'
  ),
  e(
    'Road hump',
    ['road hump', 'road humps', 'humps in the road'],
    'A raised strip across the road, put there to slow vehicles down.',
    'high',
    'A road hump across a residential street.'
  ),
  e(
    'Chicane',
    ['chicane', 'chicanes'],
    'A deliberate kink that narrows or bends the road so traffic has to slow down.',
    'high',
    'A chicane shifting the lane from one side of the road to the other.'
  ),
  e(
    'Give way',
    ['give way', 'giving way'],
    'Let other road users go first. Do not make them slow down or stop for you.',
    'high',
    'An inverted triangular give-way sign and the double broken line at a junction.',
    { example_en: 'At a pelican crossing, flashing amber means give way to people already on the crossing.' }
  ),
  e(
    'Priority',
    ['priority'],
    'Who should go first. Flashing your headlights does not give another driver priority, because they may misunderstand the signal.',
    'medium',
    null,
    { example_en: 'You wait, because the other vehicle has priority. You do not flash your lights to wave them out.' }
  ),
  e(
    'Stop line',
    ['stop line', 'stop lines'],
    'The solid white line at traffic lights, a stop sign, or an advanced stop line, where you must wait when the signal says stop.',
    'high',
    'A car waiting behind the stop line at a red traffic light.'
  ),
  e(
    'Zigzag lines',
    ['zigzag lines', 'zigzag white lines'],
    'White zigzag markings on the approach to, and the exit from, a pedestrian crossing. You must not park on them. The official questions call that illegal and an offence. You must also not overtake the leading vehicle when approaching the crossing. Parking there blocks the view for people crossing and for approaching drivers.',
    'high',
    'White zigzag lines on both approaches to a pedestrian crossing, with a car wrongly parked on them.',
    {
      review_note:
        'The bare word zigzag is no longer an alias. AB2596 says "zigzag around half-barriers" at a level crossing, which is not these markings.',
    }
  ),
  e(
    'School zigzag lines',
    ['yellow zigzag lines'],
    'Yellow zigzag lines outside a school. The official question says you should not wait or park there, because it blocks the view of the school entrance and puts children in danger.',
    'high',
    'Yellow zigzag lines outside a school entrance, with the space kept clear of parked cars.',
    {
      review_flag: true,
      review_concern: 'mapping',
      review_note:
        'BB1577 names yellow zigzag lines. AB2545 and AB2729 are picture questions about markings outside schools and do not use the words zigzag lines, so they are not linked. A reviewer who can see the image should confirm whether they belong on this card.',
    }
  ),
  e(
    'Red route',
    ['red route', 'red routes'],
    'An urban road with strict controls on stopping and parking, used to keep traffic moving.',
    'high',
    'Red lines along the edge of a city road marked as a red route.'
  ),
  e(
    'Clearway',
    ['clearway', 'clearways'],
    'A restriction shown by a sign that means you must not stop. Stopping there is likely to block the traffic.',
    'high',
    'The circular no-stopping clearway sign.'
  ),
  e(
    'Urban clearway',
    ['urban clearway'],
    'A clearway that applies at the days and times on the sign. You may stop only briefly to set down or pick up passengers.',
    'high',
    'An urban clearway sign with a time plate.'
  ),
  e(
    'Controlled parking zone',
    ['controlled parking zone'],
    'An area where the parking rules apply until you pass the sign that marks the end of the zone.',
    'medium',
    'A controlled-parking-zone sign and the sign that shows the zone has ended.'
  ),
  e(
    'Blue Badge',
    ['Blue Badge', 'disabled drivers'],
    'A badge for a disabled person. Park in a disabled bay only when you or a passenger holds one, and display it so it can be read through the windscreen. A space marked for disabled drivers is illegal to use unless you are permitted to. These spaces give extra room to people with limited mobility.',
    'medium',
    'A Blue Badge displayed on a dashboard in a disabled parking bay.'
  ),
  e(
    'Double solid white lines',
    ['double solid white line', 'double solid white lines', 'double solid white'],
    'Two continuous white lines in the middle of the road. The official question allows you to cross them only in limited cases, such as passing a stationary vehicle, passing a cyclist, horse or maintenance vehicle travelling at 10 mph or less, or turning into a side road or property.',
    'high',
    'Double solid white lines in the centre of the road, with the limited reasons you may cross them.'
  ),
  e(
    'Solid white line',
    ['solid white line'],
    'A continuous white line. Along the side of the road it shows the edge of the carriageway. It can help when it is dark or the weather is bad.',
    'medium',
    'A solid white line marking the edge of the carriageway.',
    { review_note: 'Nested inside "double solid white lines", so those questions are linked to the double-line card instead.' }
  ),
  e(
    'Hazard warning line',
    ['hazard warning line', 'long white lines'],
    'A centre marking where the white dashes are longer than the gaps. It warns of a hazard ahead. The ordinary centre line has shorter dashes than the gaps.',
    'high',
    'A centre line changing from short dashes to long hazard-warning dashes.'
  ),
  e(
    'Centre line',
    ['centre line'],
    'The broken white line in the middle of the road that separates opposing traffic. When the dashes become longer than the gaps, it is a hazard warning line.',
    'medium',
    'A normal broken centre line, with dashes shorter than the gaps.'
  ),
  e(
    'Broken white line',
    ['broken white line', 'broken white lines'],
    'A white line made of dashes. In the centre of the road, short dashes and longer gaps are the normal centre line. Longer dashes warn of a hazard.',
    'medium',
    'A broken white centre line compared with a hazard warning line.'
  ),
  e(
    'Hatched markings',
    ['hatched markings', 'hatched area', 'hatched'],
    'Diagonal stripes painted on the road to separate traffic streams that could endanger each other. If a solid white line borders the area, do not enter it except in an emergency.',
    'high',
    'A hatched area in the centre of the road bordered by a solid white line.'
  ),
  e(
    'Yellow bar markings',
    ['yellow lines painted across the road'],
    'Yellow lines painted across the road on the approach to a hazard such as a roundabout or a dangerous junction. They warn you to adjust your speed in good time.',
    'medium',
    'Yellow transverse bars across the lanes before a roundabout.',
    {
      label_origin: 'editorial_label',
      review_flag: true,
      review_concern: 'terminology',
      review_note: 'The official question says "yellow lines painted across the road" and does not use the name yellow bar markings.',
    }
  ),
  e(
    'Reflective studs',
    ['reflective studs', 'studs'],
    'Raised reflectors set into the road that shine your headlights back. On a motorway, the colour shows which part of the road you are on.',
    'high',
    'A motorway at night with red, white, amber and green studs in their positions.',
    { review_note: 'Colour-specific cards are used when the official text names a colour. This card is for studs mentioned without a winning colour phrase.' }
  ),
  e(
    'Amber reflective studs',
    ['amber reflective studs', 'amber-coloured studs', 'amber studs'],
    'Motorway studs on the right-hand edge of the carriageway, next to the central reservation.',
    'high',
    'Amber studs between the right-hand lane and the central reservation.'
  ),
  e(
    'Red reflective studs',
    ['red reflective studs', 'red studs'],
    'Motorway studs between the hard shoulder and the left edge of the carriageway.',
    'high',
    'Red studs between the hard shoulder and the left-hand lane.'
  ),
  e(
    'White reflective studs',
    ['white studs', 'white reflective studs'],
    'Motorway studs between the lanes.',
    'high',
    'White studs separating two motorway lanes.'
  ),
  e(
    'Green reflective studs',
    ['green reflective studs'],
    'Motorway studs along slip-road entrances and exits.',
    'high',
    'Green studs along the edge of a slip road.'
  ),
  e(
    'Roadworks studs',
    ['bright green/yellow'],
    'Reflective studs used at roadworks and contraflow systems. The official colour list calls them bright green/yellow.',
    'low',
    'Bright green-yellow studs through a contraflow.',
    {
      label_origin: 'editorial_label',
      review_flag: true,
      review_concern: 'terminology',
      review_note: 'The bank describes the colour but does not name a separate stud type. Confirm the label before import.',
    }
  ),
  e(
    'Countdown markers',
    ['countdown markers', 'countdown'],
    'Markers before a motorway exit. The official explanation places them 90 metres (100 yards) apart, the first 270 metres (300 yards) before the slip road.',
    'high',
    'Three countdown marker posts before a motorway slip road: 3, 2, then 1.'
  ),
  e(
    'Marker posts',
    ['marker posts', 'marker post'],
    'Posts at the edge of the hard shoulder. An arrow on them points towards the nearest emergency telephone, so the emergency services can find you.',
    'high',
    'A marker post with an arrow pointing along the hard shoulder to a telephone.'
  ),
  e(
    'Red cross',
    ['red cross', 'red crosses'],
    'A signal on an overhead motorway sign. A red cross means that lane is closed to traffic facing the signal. If a red cross is shown above every lane, you must stop.',
    'high',
    'An overhead gantry with a red cross above a closed lane and a green arrow above an open lane.'
  ),
  e(
    'Green arrow',
    ['green arrow'],
    'On an overhead lane signal, a green arrow means that lane is open to traffic facing the signal.',
    'medium',
    'A green arrow on an overhead lane signal.'
  ),
  e(
    'Lane closed',
    ['lane closed', 'lane is closed'],
    'A lane you must leave because a sign or signal shows it is closed ahead. When traffic is fast, move across in good time.',
    'medium',
    'A sign showing the right-hand lane closed ahead.'
  ),
  e(
    'Traffic lights',
    ['traffic lights', 'traffic light'],
    'Signals that control a junction. Red, amber on its own, and red together with amber all mean stop behind the line. Green means you may go if the way is clear.',
    'medium',
    'A traffic light showing red, then red and amber, then green, then amber.',
    { watch_coverage: true }
  ),
  e(
    'Red and amber',
    ['red and amber'],
    'Red and amber traffic lights showing together. This means stop, the same as red alone or amber alone. Wait behind the stop line until the light is green and the way is clear.',
    'high',
    'A traffic light with the red and amber lamps lit together.'
  ),
  e(
    'Flashing amber',
    ['flashing amber', 'flashing amber light'],
    'At a pelican crossing, flashing amber means give way to pedestrians already on the crossing. If the crossing is clear, you may go. A puffin crossing uses a steady amber light instead.',
    'high',
    'A pelican crossing with the amber light flashing and a pedestrian still on the crossing.',
    { review_note: 'Longer phrases such as "flashing amber beacon" belong to the beacon card, not this one.' }
  ),
  e(
    'Pelican crossing',
    ['pelican crossing', 'pelican crossings', 'pelican'],
    'A push-button pedestrian crossing. It has a flashing amber light rather than a red-and-amber stage. Give way to people on the crossing while that light flashes.',
    'high',
    'A pelican crossing with the push button and a flashing amber traffic light.',
    { review_note: 'The alias "pelican" should be checked if any link is not about the crossing.' }
  ),
  e(
    'Puffin crossing',
    ['puffin crossing', 'puffin'],
    'A pedestrian crossing with sensors that hold the red light while people are still crossing. After green, the next light is steady amber, not flashing amber.',
    'high',
    'A puffin crossing with a sensor watching the crossing area.'
  ),
  e(
    'Toucan crossing',
    ['toucan crossing', 'toucan'],
    'A crossing where pedestrians and cyclists may cross at the same time. Cyclists may approach the crossing quickly.',
    'high',
    'A toucan crossing with a pedestrian and a cyclist crossing side by side.'
  ),
  e(
    'Zebra crossing',
    ['zebra crossing', 'zebra'],
    'A pedestrian crossing marked with black-and-white stripes. If people are waiting to cross, slow down and be prepared to stop.',
    'high',
    'A zebra crossing with black-and-white stripes and people waiting on the pavement.'
  ),
  e(
    'Pedestrian crossing',
    ['pedestrian crossing', 'pedestrian crossings'],
    'A place provided for people to cross the road. Slow down if people are waiting. Do not wave them across, because another driver may not see them or be able to stop.',
    'medium',
    'A pedestrian waiting at a crossing while a driver does not wave them across.'
  ),
  e(
    'Arm signal',
    ['arm signal', 'arm signals'],
    'A hand signal used so other road users can see what you intend, for example if your indicators cannot be seen. The Highway Code shows the signals.',
    'medium',
    'A driver giving an arm signal for slowing down or turning.'
  ),
  e(
    'Hazard warning lights',
    ['hazard warning lights'],
    'All the direction indicators flashing together. Use them if you have broken down and are causing an obstruction, or to warn following traffic of danger ahead on a motorway or unrestricted dual carriageway. They are not an excuse to park illegally.',
    'high',
    'A car stopped at the roadside with all four indicators flashing.'
  ),
  e(
    'Indicators',
    ['indicator', 'indicators', 'indicating'],
    'The flashing lights that show you intend to change direction. Cancel them when you have finished, so you do not mislead other drivers. If the vehicle in front leaves a right indicator on, do not assume it is safe to overtake.',
    'medium',
    'A car indicator flashing on the right.'
  ),
  e(
    'Brake lights',
    ['brake lights', 'brake light'],
    'The red lights at the rear that come on when the footbrake is pressed, telling drivers behind that you are slowing down.',
    'medium',
    'Rear brake lights lit on a slowing car.'
  ),
  e(
    'Dipped headlights',
    ['dipped headlights', 'dipped beam', 'headlights on dipped'],
    'The normal headlight beam, aimed down so you can be seen without dazzling other people. Use them when traffic is coming towards you, when you are following, and when visibility is poor.',
    'high',
    'A comparison of dipped headlights and main beam, with the dipped beam aimed down.'
  ),
  e(
    'Main beam',
    ['main beam', 'full beam', 'full-beam', 'full-beam headlights'],
    'The brightest headlight beam, also called full beam. Use it only when you will not dazzle anyone. Dip it for oncoming traffic and when you are following another vehicle.',
    'high',
    'A headlight switch showing dipped beam and main beam.'
  ),
  e(
    'Rear fog lights',
    ['rear fog lights', 'rear fog light', 'rear fog'],
    'Very bright lights at the back for when visibility is seriously reduced. The questions describe this as about 100 metres (328 feet) or less. Switch them off when visibility improves, because they dazzle drivers behind you.',
    'high',
    'A rear fog light switched on in thick fog, and switched off once the road is clearer.'
  ),
  e(
    'Front fog lights',
    ['front fog lights', 'front fog'],
    'Extra front lights for seriously reduced visibility. The official question limits their use to about 100 metres (328 feet) or less. Turn them off when you can see further.',
    'high',
    'Front fog lights on a car in thick fog.'
  ),
  e(
    'Fog lights',
    ['fog lights', 'front and rear fog lights'],
    'Extra lights for seriously reduced visibility. Use them only while you need them, then switch them off so they do not dazzle other people.',
    'medium',
    'A dashboard switch for front and rear fog lights.',
    { review_note: 'Questions that name front or rear fog lights are linked to those more specific cards instead.' }
  ),
  e(
    'Parking lights',
    ['parking lights', 'parking light'],
    'Lights left on so a parked vehicle can be seen. One official question requires them when you park at night on a road with a speed limit greater than 30 mph.',
    'medium',
    'A car parked at night on a faster road with parking lights on.'
  ),
  e(
    'Sidelights',
    ['sidelights', 'sidelight'],
    'Small lights that show the outline of the vehicle. At night in a well-lit built-up area, dipped headlights make you easier to see than sidelights alone.',
    'medium',
    'Sidelights compared with dipped headlights on a lit street at night.'
  ),
  e(
    'Seriously reduced visibility',
    ['seriously reduced'],
    'Visibility so poor that other people cannot see you properly, as in thick fog. The fog-light questions describe this as about 100 metres or less. Use dipped headlights, and fog lights only while it lasts.',
    'high',
    null
  ),
  e(
    'No entry',
    ['no entry'],
    'A sign that means you must not drive into that road.',
    'high',
    'A circular no-entry sign at the mouth of a road.'
  ),
  e(
    'No through road',
    ['no through road'],
    'A road that does not lead through to another route. You would have to turn round and come back.',
    'high',
    'A no-through-road sign, including the version for a side road on the left.'
  ),
  e(
    'No motor vehicles',
    ['no motor vehicles'],
    'A prohibition sign meaning motor vehicles must not use that road.',
    'high',
    'A circular no-motor-vehicles sign.'
  ),
  e(
    'No stopping',
    ['no stopping'],
    'A restriction that means you must not stop, even for a moment. A clearway is one form of this rule.',
    'medium',
    'A no-stopping sign.'
  ),
  e(
    'No overtaking',
    ['no overtaking'],
    'A sign that means you must not overtake other vehicles.',
    'high',
    'A circular no-overtaking sign.'
  ),
  e(
    'National speed limit',
    ['national speed limit'],
    'The default maximum speed where no lower limit is signed. The number depends on the road and the vehicle. For cars and motorcycles, the questions give 70 mph on a motorway or dual carriageway and 60 mph on a single carriageway, unless signs show otherwise. Towing a trailer is lower: the questions give 60 mph on a dual carriageway or motorway. The sign is a white circle with a black diagonal bar.',
    'high',
    'The national speed limit sign: a white circle with a black diagonal stripe.',
    {
      example_en: 'The national speed limit applies and traffic is coming towards you, so you use dipped headlights rather than main beam.',
      review_flag: true,
      review_concern: 'explanation',
      previous_explanation_en:
        'The default maximum speed where no lower limit is signed. The actual number depends on the type of road and vehicle. The sign is a white circle with a black diagonal bar.',
      review_note:
        'BB1207 answers 50 mph for a car towing a trailer on a single carriageway that "has this sign". The sign is not named in the text, so 50 mph is not stated on this card. Confirm the sign before adding that figure.',
    }
  ),
  e(
    'Street lights',
    ['where there are street lights', 'see street lights', 'presence of street lights'],
    'Where there are street lights and no speed-limit sign, the questions give a 30 mph limit in England, Scotland and Northern Ireland. In Wales, the same questions give 20 mph, unless signs show another limit.',
    'high',
    'A lit street with no speed-limit sign. England, Scotland and Northern Ireland are marked 30 mph, and Wales is marked 20 mph.'
  ),
  e(
    'Speed limit',
    ['speed limit', 'speed limits'],
    'The highest speed permitted on a stretch of road. Bad weather, traffic or a hazard can mean you should drive more slowly than that maximum.',
    'medium',
    'A circular speed-limit sign.',
    { watch_coverage: true }
  ),
  e(
    'Mandatory speed limit',
    ['mandatory speed limit', 'mandatory signs', 'are mandatory'],
    'A speed limit you must obey. Limits shown in a red circle, including temporary limits at roadworks, are orders, not advice.',
    'medium',
    'A temporary 40 mph limit inside a red circle at roadworks.'
  ),
  e(
    'Variable speed limit',
    ['variable speed limit', 'variable speed limits'],
    'A speed limit that can change and is shown on overhead signs. On motorways it is used to keep traffic moving and to reduce bunching.',
    'high',
    'An overhead gantry showing different speed limits above the lanes.'
  ),
  e(
    'Temporary speed limit',
    ['temporary speed limit'],
    'A lower speed limit used for a short time, often at roadworks. It is mandatory. Slow down in good time.',
    'medium',
    'A temporary speed-limit sign at roadworks.'
  ),
  e(
    'Minimum speed',
    ['minimum speed'],
    'A signed lowest speed. The questions show 30 mph. It is used where slow vehicles would hold up traffic, for example in a tunnel. You should still slow down or stop to avoid a collision. A red slash through the sign means that minimum has ended.',
    'medium',
    'A minimum-speed sign showing 30, and the same sign with a red slash through it.'
  ),
  e(
    'Circular traffic sign',
    ['shape of a circle', 'signs giving orders', 'give orders'],
    'A circular sign gives an order. Signs with a red circle are mostly prohibitions. The stop sign is octagonal so that it stands out.',
    'high',
    'A red circular prohibition sign beside an octagonal stop sign.'
  ),
  e(
    'Triangular traffic sign',
    ['triangular'],
    'A sign with a triangular shape. In UK signing this shape usually warns of a hazard ahead. Triangular shapes above and below a measurement can also show a height restriction.',
    'medium',
    'A red-bordered triangular warning sign beside a height-restriction plate with triangular shapes.'
  ),
  e(
    'Octagonal stop sign',
    ['octagonal', 'octagon'],
    'Eight-sided. The stop sign uses this shape so drivers recognise it quickly. You must stop at it.',
    'high',
    'An octagonal stop sign.'
  ),
  e(
    'School crossing patrol',
    ['school crossing patrol', 'school crossing patrols', 'crossing patrol'],
    'A person authorised to stop traffic so people can cross near a school. You must obey their signal to stop.',
    'high',
    'A school crossing patrol holding the stop sign out towards traffic.'
  ),
  e(
    'White stick',
    ['white stick'],
    'A cane carried by a person who is blind. A white stick with a red band means the person is deaf as well as blind, so they may not hear a horn.',
    'high',
    'A white stick, and a white stick with a red reflective band.'
  ),
  e(
    'Flashing amber beacon',
    ['flashing amber beacon', 'amber beacon', 'amber flashing beacon'],
    'A flashing amber light on a slow or special vehicle. Powered vehicles used by disabled people must show one on an unrestricted dual carriageway.',
    'high',
    'A small powered vehicle showing a flashing amber beacon.'
  ),
  e(
    'Green flashing beacon',
    ['green flashing beacon', 'green flashing'],
    'A flashing green light meaning a doctor is answering an emergency call. Give way if it is safe to do so.',
    'high',
    'A car with a green flashing beacon on the roof.'
  ),
  e(
    'Blue flashing lights',
    ['flashing blue lights', 'blue flashing', 'blue lights'],
    'The flashing blue lights of an emergency vehicle such as an ambulance. Pull over where it can pass safely.',
    'medium',
    'An ambulance with blue lights flashing, and a car pulling over.'
  ),
  e(
    'Traffic officer',
    ['traffic officer', 'traffic officers'],
    'An officer in an orange-and-yellow jacket who works on motorways and some primary routes in England and Wales. They can stop and direct people, but they do not have police enforcement powers.',
    'high',
    'A traffic officer in a high-visibility jacket beside a traffic-officer vehicle.'
  ),
  e(
    'Bollard',
    ['bollard', 'bollards'],
    'A short fixed post used to separate or protect part of the road. Do not assume a wide vehicle can get through if bollards block the gap.',
    'low',
    'Bollards narrowing a gap at the side of the road.'
  ),
  e(
    'Blind spot',
    ['blind spot', 'blind spots', 'blind area'],
    'The area around your vehicle that the mirrors do not show. Look around, including over your shoulder, before you move off, change lane or turn.',
    'high',
    'A car with shaded zones that the interior and door mirrors do not cover.',
    {
      example_en: 'Before you move off from behind a parked car, check the mirrors and look around for the blind spots.',
      review_flag: true,
      review_concern: 'mapping',
      review_note:
        'Blind spot, blind spots and blind area are one concept. AB2001 and AB2687 are linked from "look over your shoulder" and do not use the words blind spot. Confirm those two links before import.',
    }
  ),
  e(
    'Blind-spot monitoring',
    ['blind-spot monitoring', 'blind spot monitoring'],
    'Sensors that warn you of a vehicle in a blind spot. They work only if the sensors are clean, and they do not replace looking.',
    'high',
    'A door mirror with a blind-spot warning light, and the sensor on the rear corner of the car.'
  ),
  e(
    'Convex mirror',
    ['convex'],
    'A mirror curved outwards so you can see a wider area. Objects look smaller and further away than they are, and it still does not show every blind spot.',
    'medium',
    'A flat mirror and a convex mirror showing the same scene, with the convex view wider.'
  ),
  e(
    'Anti-dazzle mirror',
    ['anti-dazzle'],
    'A setting on the interior mirror that dims the glare of headlights behind you at night. You can still see the lights, but the dazzle is reduced.',
    'medium',
    'An interior mirror being tipped into the anti-dazzle position.'
  ),
  e(
    'Windscreen pillar',
    ['windscreen pillar', 'windscreen pillars'],
    'The post at the side of the windscreen. It can hide a cyclist, motorcyclist or pedestrian, especially as you approach a bend or a junction.',
    'medium',
    'A driver\'s view with a cyclist hidden behind the windscreen pillar.'
  ),
  e(
    'Kick-down',
    ['kick-down'],
    'On an automatic, pressing the accelerator firmly through so the gearbox changes to a lower gear and the car can accelerate more quickly.',
    'high',
    'An accelerator pedal pressed fully down, with the automatic gearbox changing down.',
    { example_en: 'You need to accelerate quickly, so you use kick-down rather than changing gear by hand.' }
  ),
  e(
    'Coasting',
    ['coasting'],
    'Freewheeling with the clutch held down, or with the gear lever in neutral. You have less control, and the engine cannot help to slow or steady the car.',
    'high',
    'A diagram of a clutch pedal held down while the car is moving.',
    { example_en: 'Travelling a long way in neutral is coasting, and it reduces your control.' }
  ),
  e(
    'Clutch',
    ['clutch'],
    'The pedal that disconnects the engine from the wheels while you change gear. Holding it down while the car is moving is coasting.',
    'medium',
    'The clutch, brake and accelerator pedals, with the clutch labelled.'
  ),
  e(
    'Neutral',
    ['neutral'],
    'The gear position where the engine is not driving the wheels. Letting the car roll in neutral is coasting and reduces control.',
    'medium',
    null
  ),
  e(
    'Engine braking',
    ['engine braking', 'engine as a brake'],
    'Using a lower gear so the engine helps to slow the vehicle. It is useful on a long downhill, where the brakes can overheat if you rely on them alone.',
    'high',
    null
  ),
  e(
    'Brake fade',
    ['brake fade'],
    'Brakes losing power because they have overheated, which can happen on a long downhill. Select a lower gear so you are not riding the brakes.',
    'high',
    null
  ),
  e(
    'Lower gear',
    ['lower gear'],
    'A gear that gives more engine braking and more control, used for hills, sharp bends and kick-down. Slow down with the brakes before you select it.',
    'medium',
    null
  ),
  e(
    'Parking brake',
    ['parking brake'],
    'The brake that holds a parked vehicle, sometimes called the handbrake. In a queue at night you can apply it and release the footbrake so your brake lights do not dazzle the driver behind.',
    'medium',
    'A parking-brake lever, with brake lights off while the car waits in a night queue.'
  ),
  e(
    'Footbrake',
    ['footbrake'],
    'The pedal that works the main brakes. Pressing it also switches on the brake lights.',
    'medium',
    'The footbrake pedal labelled among the pedals.'
  ),
  e(
    'Accelerator',
    ['accelerator'],
    'The pedal that makes the engine speed up. If someone cuts in, ease off it and drop back instead of braking sharply.',
    'low',
    'The accelerator pedal labelled.'
  ),
  e(
    'Automatic transmission',
    ['automatic transmission', 'have an automatic'],
    'A gearbox that changes gear for you. When you park facing downhill, select Park if the car is automatic. Kick-down is used when you need a lower gear for quicker acceleration.',
    'medium',
    null
  ),
  e(
    'Anti-lock brakes',
    ['anti-lock brakes', 'anti-lock braking system', 'anti-lock', 'ABS'],
    'A system that helps stop the wheels locking when you brake hard. If the ABS warning light stays on, have the brakes checked before you continue. The handbook or a garage can tell you whether it is safe to drive there.',
    'high',
    'An ABS warning light on an instrument panel.',
    { example_en: 'The ABS light stays on after you start the engine, so you have the brakes checked immediately.' }
  ),
  e(
    'Brake fluid',
    ['brake fluid', 'brake-fluid'],
    'The fluid that carries the force from the brake pedal to the brakes. If the level falls too low, air can enter and the brakes can fail. Check it often.',
    'high',
    'A brake-fluid reservoir with the level below the minimum mark.'
  ),
  e(
    'Shock absorbers',
    ['shock absorbers', 'shock absorber'],
    'Parts that stop the car bouncing after a bump. If it keeps bouncing when you press down over a wheel and let go, they may be worn.',
    'high',
    'A wheel being pushed down and the car continuing to bounce.'
  ),
  e(
    'Head restraint',
    ['head restraint', 'head restraints'],
    'The pad behind your head. When it is adjusted properly it reduces the risk of neck injury in a collision. Do not leave it too low.',
    'high',
    'A head restraint level with the back of the head, not sitting down at the neck.'
  ),
  e(
    'Seat belt',
    ['seat belt', 'seat belts'],
    'The belt that holds you in your seat. You may undo it while you are reversing, but put it back on before you drive on. The driver is responsible for seat belts worn by passengers under 14.',
    'medium',
    'A correctly worn seat belt.'
  ),
  e(
    'Child restraint',
    ['child restraint', 'child seat'],
    'A child seat or booster made for a child\'s size. If you carry passengers under 14, you must make sure they use a seat belt or a suitable child restraint.',
    'high',
    'A child in a suitable child seat in the back of a car.'
  ),
  e(
    'Rear-facing baby seat',
    ['rear-facing baby seat', 'rear-facing'],
    'A baby seat that faces backwards. It must not be used on a front seat protected by an active frontal airbag. Deactivate that airbag or put the seat somewhere else.',
    'high',
    'A rear-facing baby seat on a front seat, with the airbag switched off.',
    { review_note: 'Check "rear-facing" is the baby seat, not simply the rear of a vehicle.' }
  ),
  e(
    'Airbag',
    ['airbag', 'airbags'],
    'A cushion that inflates in a serious collision. A frontal airbag can seriously injure a baby in a rear-facing seat, so that airbag must be off or the seat must go elsewhere.',
    'high',
    'A frontal airbag area on the passenger side, marked as deactivated.'
  ),
  e(
    'Catalytic converter',
    ['catalytic converter'],
    'A unit in the exhaust system that reduces poisonous gases from the engine.',
    'high',
    'A catalytic converter in the exhaust under a car.'
  ),
  e(
    'Filler cap',
    ['filler cap'],
    'The cap on the fuel tank. If it is loose, fuel can spill and make the road slippery, especially diesel on bends and roundabouts.',
    'medium',
    'A fuel filler cap that is not secured, with diesel spilled on the road.'
  ),
  e(
    'Tyre tread',
    ['tread depth', 'tread', 'treads'],
    'The grooved surface of a tyre that grips the road. The legal minimum in the official questions is 1.6 mm for car tyres and for trailer or caravan tyres, across the central three-quarters of the tyre, all the way round. Deep cuts or bulges also make a tyre illegal.',
    'high',
    'A tyre tread depth gauge showing 1.6 mm across the central part of the tread.'
  ),
  e(
    'Under-inflated tyres',
    ['under-inflated'],
    'Tyres with too little air. They waste fuel, increase stopping distance, and give poorer steering and braking.',
    'high',
    'A tyre shown under-inflated, with the sidewall bulging.'
  ),
  e(
    'Tyre pressure',
    ['tyre pressure', 'tyre pressures'],
    'The amount of air in a tyre. Use the pressure recommended for that vehicle. Wrong pressure affects grip, fuel use and stopping distance.',
    'medium',
    'A tyre pressure gauge on a tyre valve.'
  ),
  e(
    'Unbalanced wheels',
    ['wheels are unbalanced'],
    'Wheels whose weight is uneven around the rim. They make the steering vibrate at some speeds and need to be rebalanced.',
    'medium',
    null
  ),
  e(
    'Warning light',
    ['warning light', 'warning lights', 'instrument panel', 'instrument-panel'],
    'A symbol on the instrument panel. Learn what each one means before you drive an unfamiliar vehicle. If a warning such as the ABS light stays on, have it checked before you continue.',
    'medium',
    'A simple instrument panel with oil, battery and ABS warning symbols.',
    { review_note: 'Hazard warning lights are a separate card. This card is for dashboard warnings.' }
  ),
  e(
    'Engine oil',
    ['engine oil', 'too much oil'],
    'Oil that lubricates the engine. Too much oil raises the pressure inside and can make the oil seals leak. Drain off any extra.',
    'medium',
    'An oil dipstick showing the level above the maximum mark.'
  ),
  e(
    'Vehicle handbook',
    ['handbook', 'vehicle handbook'],
    'The manufacturer\'s book for the vehicle. It explains controls, warning lights and limits such as the maximum noseweight.',
    'low',
    null
  ),
  e(
    'Electronic stability control',
    ['electronic stability control', 'ESC'],
    'A system that senses when the car is losing grip and adjusts the brakes to help you keep control. The light comes on briefly when it works. It cannot save a car that has already lost all grip.',
    'high',
    'An ESC warning light on a dashboard.'
  ),
  e(
    'Advanced driver assistance',
    ['advanced driver assistance', 'ADAS', 'adaptive cruise control', 'cruise control'],
    'Systems that help the driver, such as adaptive cruise control. They are not self-driving. You stay responsible and must be ready to take over.',
    'high',
    null,
    { review_note: 'Cruise control is grouped here because the official question treats adaptive cruise control as an ADAS function. Split it if a later question uses cruise control on its own.' }
  ),
  e(
    'Aquaplaning',
    ['aquaplaning'],
    'When a tyre rides up on a layer of water and loses contact with the road. The steering can suddenly feel light. Ease off and do not brake until the steering feels normal again.',
    'high',
    'A tyre lifted off the road surface on a film of water.',
    { example_en: 'In heavy rain the steering suddenly feels very light. That is aquaplaning.' }
  ),
  e(
    'Wheelspin',
    ['wheelspin'],
    'When a driving wheel spins instead of gripping. On ice, a slow speed and the highest gear you can use reduce the risk.',
    'high',
    'A wheel spinning on an icy surface.'
  ),
  e(
    'Skid',
    ['skid', 'skidding'],
    'When the tyres lose grip and the vehicle slides. Braking hard while you turn sharply makes a skid more likely. Slow down before the bend.',
    'high',
    'A car starting to slide as the driver brakes hard on a bend.'
  ),
  e(
    'Icy road',
    ['icy', 'icy road', 'icy conditions', 'risk of ice'],
    'A road with ice on the surface. Grip is poor and stopping takes much longer. One official question says icy stopping distances can be about ten times the dry distance. Use a slow speed and a high gear to reduce wheelspin.',
    'high',
    'A shaded, icy stretch of road that does not look obviously frozen.',
    { example_en: 'On ice you leave about ten times the normal distance from the car in front.' }
  ),
  e(
    'Side wind',
    ['side wind', 'side winds'],
    'Wind blowing across the road. It can push you as you pass a large vehicle, go through a gap in hedges or buildings, or cross an exposed stretch or a bridge.',
    'high',
    'A car being pushed sideways by wind after passing a high-sided lorry.'
  ),
  e(
    'High-sided vehicle',
    ['high-sided vehicle', 'high-sided'],
    'A tall vehicle, such as a bus or a high-sided lorry. Crosswinds affect it more, and it may need the centre of a narrow road or bridge to get through.',
    'high',
    'A high-sided lorry taking the centre of a narrow bridge.'
  ),
  e(
    'Spray',
    ['spray'],
    'Water thrown up by tyres on a wet road, especially by large vehicles. It hides the road ahead. Stay further back so you can see.',
    'medium',
    'Spray thrown up by a lorry, hiding the car behind it.'
  ),
  e(
    'Flood water',
    ['flood water', 'flood'],
    'Water lying across the road. After you have driven through it, go slowly and press the brakes gently so they dry out and start to work again.',
    'high',
    'A car leaving flood water and the driver testing the brakes gently.',
    { review_note: 'Check the alias "flood" is standing water on the road.' }
  ),
  e(
    'Slippery road',
    ['slippery'],
    'A road surface with little grip, such as tram rails, spilled diesel, ice or a wet road after a dry spell. Slow down before you reach it.',
    'medium',
    'A slippery-road warning sign.'
  ),
  e(
    'Stopping distance',
    ['stopping distance', 'stopping distances', 'overall stopping distance'],
    'The distance the vehicle travels from the moment you notice a hazard until it stops. It gets longer as speed rises. The questions say it can double in the rain and can be up to 10 times longer on ice. Under-inflated or worn tyres also make it longer.',
    'high',
    'A simple diagram of the distance from seeing a hazard to stopping, longer on a wet road than on a dry road.',
    { example_en: 'In the rain, your overall stopping distance can be double the dry-road distance.' }
  ),
  e(
    'Two-second rule',
    ['two-second rule', 'two-second'],
    'A way to check the gap in front in good, dry conditions. When the vehicle ahead passes a fixed point, you should be able to say "Only a fool breaks the two-second rule" before you reach it. Leave a longer gap in the wet or on ice.',
    'high',
    'Two cars and a roadside post, with a two-second gap marked between them.',
    { example_en: 'The car ahead passes a bridge. You should not reach that bridge for about two seconds.' }
  ),
  e(
    'Separation distance',
    ['separation distance', 'separation gap'],
    'The gap you leave behind the vehicle in front. In dry conditions the questions use about two seconds. On a wet road they use a longer gap, described as four seconds in one question.',
    'high',
    'A safe gap between two cars, shown as about two seconds in the dry.',
    { example_en: 'Someone cuts in close. You drop back until the separation distance is right again.' }
  ),
  e(
    'Dazzle',
    ['dazzle', 'dazzled', 'dazzling'],
    'Glare from headlights that makes it hard to see. Dip your own headlights for oncoming traffic and when following. If a vehicle behind dazzles you, set the interior mirror to anti-dazzle.',
    'medium',
    'Oncoming main-beam headlights dazzling a driver, who dips their own lights.'
  ),
  e(
    'Fog',
    ['fog', 'foggy'],
    'Thick mist that cuts visibility. Use dipped headlights. Use fog lights only while visibility is seriously reduced, and leave a longer gap.',
    'medium',
    'A road in fog with a car using dipped headlights.'
  ),
  e(
    'SORN',
    ['SORN', 'Statutory Off-Road Notification'],
    'A Statutory Off-Road Notification to the DVLA. It tells them a vehicle is not being used on the public road, so it can stay untaxed. It lasts until the vehicle is taxed, sold or scrapped.',
    'high',
    null,
    { example_en: 'The car is kept off the road and is not taxed. You make a SORN, and it ends when you tax, sell or scrap the car.' }
  ),
  e(
    'MOT',
    ['MOT', 'MOT test', 'MOT certificate'],
    'The roadworthiness test for vehicles that need one. Driving without a current certificate when the vehicle requires one is illegal, and the insurance may be invalid. You may drive to a pre-arranged test, or to a garage for repairs the test requires.',
    'high',
    null
  ),
  e(
    'V5C',
    ['V5C', 'vehicle registration certificate', 'registration certificate', 'registration document'],
    'The vehicle registration certificate. The registered keeper must keep the name, address and vehicle details on it up to date.',
    'high',
    'The front of a V5C registration certificate, with personal details covered.'
  ),
  e(
    'Registered keeper',
    ['registered keeper', 'registered vehicle keeper'],
    'The person named on the V5C who is responsible for the vehicle record. They must tell the DVLA if their name, address or the vehicle details change.',
    'high',
    null
  ),
  e(
    'Vehicle tax',
    ['vehicle tax'],
    'The tax required to use a vehicle on the public road. The registered keeper is responsible for paying it. When you renew it you need valid insurance, and a current MOT certificate where one applies.',
    'medium',
    null
  ),
  e(
    'Third-party insurance',
    ['third-party insurance', 'third-party', 'third party'],
    'Insurance that covers injury and damage you cause to other people. It is the legal minimum. It does not cover damage to your own vehicle, and basic third-party cover does not include fire and theft.',
    'high',
    null,
    { example_en: 'Third party only pays for damage you cause to others, not for repairs to your own car.' }
  ),
  e(
    'Comprehensive insurance',
    ['comprehensive cover', 'comprehensive'],
    'A wider motor policy than third-party cover. The official explanation contrasts it with third-party insurance, which does not pay for damage to your own vehicle.',
    'medium',
    null,
    { review_note: 'The bank contrasts comprehensive with third-party cover. Do not add benefits the questions do not state.' }
  ),
  e(
    'Insurance excess',
    ['excess of', 'an excess', 'the excess'],
    'The amount you agree to pay yourself towards an insurance claim. The insurer pays the rest. A higher excess can lower the premium.',
    'high',
    null,
    { example_en: 'With an excess of £500, you pay the first £500 of a claim yourself.', review_note: 'Aliases avoid the different meaning in "excess oil".' }
  ),
  e(
    'Insurance',
    ['insurance'],
    'A policy that covers your liability when you drive. You must be insured for the vehicle on public roads. The legal minimum is third-party cover. Driving without it can mean an unlimited fine, points or disqualification.',
    'medium',
    null,
    { watch_coverage: true }
  ),
  e(
    'Penalty points',
    ['penalty points'],
    'Points added to a driving licence after certain offences. One official question says that 6 or more points within 2 years of a first full licence revoke that licence. You then drive as a learner until you pass the theory and practical tests again.',
    'high',
    null,
    { watch_coverage: true }
  ),
  e(
    'Provisional licence',
    ['provisional driving licence', 'provisional licence', 'provisional'],
    'A learner\'s licence. You must not drive unaccompanied until you have passed the practical test.',
    'high',
    null
  ),
  e(
    'Newly qualified driver',
    ['newly qualified'],
    'A driver who has just gained a first full licence. They must be insured. Six or more penalty points within two years revoke that licence in the official question.',
    'medium',
    null
  ),
  e(
    'Learner driver',
    ['learner driver', 'as a learner'],
    'A person who has not passed the practical test, or whose full licence has been revoked. They must be accompanied while they drive.',
    'medium',
    'L plates on a car, with a supervising driver in the front passenger seat.',
    { review_note: 'The bank says a revoked new driver may only drive as a learner. It does not use the words "L plates" in the passage checked, so the image is optional.' }
  ),
  e(
    'Pass Plus',
    ['Pass Plus'],
    'A course for new drivers, mentioned in the bank as including motorway driving after you have passed the test.',
    'low',
    null
  ),
  e(
    'Driving licence',
    ['driving licence'],
    'The licence that shows what you are allowed to drive. A police officer can ask to see it, together with your insurance and, where it applies, the MOT certificate.',
    'medium',
    null
  ),
  e(
    'DVLA',
    ['DVLA'],
    'The Driver and Vehicle Licensing Agency. You tell the DVLA when you make a SORN and when the keeper\'s name, address or vehicle details change.',
    'medium',
    null
  ),
  e(
    'Produce documents',
    ['produce them at a police station', 'produce this document', 'asks to see your documents'],
    'If a police officer asks for your driving licence, insurance or MOT and you do not have them with you, you may have to take them to a police station. The official question allows 7 days.',
    'medium',
    null
  ),
  e(
    'Eyesight',
    ['eyesight', 'glasses'],
    'How well you can see. You must be able to read a number plate at the required distance. If you need glasses to do that, wear them whenever you drive.',
    'medium',
    null
  ),
  e(
    'Number plate',
    ['number plate', 'number plates'],
    'The registration plate on a vehicle. The eyesight standard in the questions is being able to read one at the required distance.',
    'medium',
    'A number plate viewed from the required eyesight-test distance.'
  ),
  e(
    'Hand-held mobile phone',
    ['hand-held mobile', 'hand-held'],
    'A phone you hold while using it. It is illegal to use one while driving or riding, except in a genuine emergency. If it rings, leave it until you have stopped in a safe place.',
    'high',
    'A driver leaving a ringing phone alone until the car is parked safely.',
    {
      example_en: 'The phone rings while you are moving. You leave it and deal with the call only after you have stopped safely.',
      review_note:
        'Questions about calling for help from a motorway, or about a hands-free phone, are not linked. Those uses are covered by other cards.',
    }
  ),
  e(
    'Hands-free',
    ['hands-free'],
    'A phone kit you do not hold in your hand. It can still take your attention off the road. The questions treat that distraction as a real risk.',
    'high',
    null
  ),
  e(
    'Alcohol',
    ['alcohol'],
    'Alcohol reduces your judgement of speed, your coordination and your control, and it can make you overconfident. There are serious consequences if you drive when you may be over the drink-drive limit.',
    'medium',
    null
  ),
  e(
    'Drugs',
    ['drugs', 'drug'],
    'Drugs, including some medicines, can make you unfit to drive. A conviction for driving when unfit through drink or drugs can also make insurance more expensive.',
    'medium',
    null
  ),
  e(
    'Drowsiness',
    ['drowsiness', 'drowsy'],
    'Sleepiness, including sleepiness caused by medicine. Do not drive if a medicine makes you drowsy. Check with your doctor if you are unsure.',
    'high',
    null
  ),
  e(
    'Tiredness',
    ['tired', 'sleepy'],
    'Being too tired to drive safely. It slows your reactions. On a motorway, leave at the next exit or a service area and rest. Do not stop on the hard shoulder to sleep.',
    'medium',
    null
  ),
  e(
    'Concentration',
    ['concentration'],
    'Keeping your attention on the road. On a long journey, plan rest stops. The questions recommend a break of at least 15 minutes after every 2 hours.',
    'medium',
    null
  ),
  e(
    'Highway Code',
    ['Highway Code'],
    'The official book of UK road rules and guidance. It includes the signals a police officer uses when directing traffic.',
    'medium',
    null
  ),
  e(
    'Disqualified',
    ['disqualified', 'disqualification'],
    'Banned by a court from driving. Driving without insurance can lead to a fine, penalty points or disqualification.',
    'low',
    null
  ),
  e(
    'Casualty',
    ['casualty', 'casualties'],
    'An injured person. Move a casualty only if there is further danger. The sooner the right help arrives, the better their chance.',
    'high',
    null
  ),
  e(
    'Unconscious',
    ['unconscious'],
    'Not awake and not responding. If the person is breathing, the recovery position helps keep the airway open. Do not remove an injured motorcyclist\'s helmet unless it is essential, because movement can make the injury worse.',
    'medium',
    'An unconscious motorcyclist with the helmet left in place.'
  ),
  e(
    'Recovery position',
    ['recovery position'],
    'A position for an unconscious person who is breathing, used to help keep the airway open. Keep checking the airway until medical help arrives.',
    'high',
    'A person placed in the recovery position, with the airway kept open.'
  ),
  e(
    'Airway',
    ['airway'],
    'The passage from the mouth and nose into the lungs. After a casualty is put in the recovery position, make sure the airway stays open.',
    'high',
    'A first-aid diagram showing an open airway in the recovery position.'
  ),
  e(
    'Cardiopulmonary resuscitation',
    ['cardiopulmonary resuscitation', 'CPR', 'chest compressions', 'chest compression'],
    'Pressing hard and fast on the centre of the chest when someone is not breathing normally. The questions describe about two compressions each second. For an adult they say about 5 to 6 centimetres with two hands. For a child they say you may use one hand and press about 4 to 5 centimetres. For an infant they say two fingers and about one third of the chest depth. Continue until the person breathes normally, a professional takes over, or an AED tells you to stop.',
    'high',
    'Hands placed on the centre of a casualty\'s chest for CPR.',
    { review_note: 'Chest compressions are included because the bank teaches them as part of CPR.' }
  ),
  e(
    'Defibrillator',
    ['defibrillator', 'AED', 'public access defibrillator'],
    'A machine, also called an AED, that can give an electric shock to try to restart a heart. Anyone may use a public one. It gives spoken or on-screen instructions and will not shock a person unless a shock is needed. The 999 operator can direct you to the nearest one.',
    'high',
    'A public access defibrillator cabinet, with simple on-screen instructions.',
    { example_en: 'You call 999 and the operator directs you to the nearest AED.' }
  ),
  e(
    'Bleeding',
    ['bleeding'],
    'Serious blood loss. If nothing is stuck in the wound, lay the person down if you can and press firmly with clean material.',
    'medium',
    'Firm pressure being applied to a bleeding arm wound with a clean cloth.'
  ),
  e(
    'Burns',
    ['burns'],
    'Heat injury to the skin. Cool the burn with clean, cool water for at least 20 minutes. Do not burst blisters, because that can cause infection.',
    'medium',
    'Clean cool water being poured over a burn.'
  ),
  e(
    'Warning triangle',
    ['advance warning triangle', 'a warning triangle', 'the warning triangle', 'warning triangles'],
    'A reflective triangle placed back along the road to warn drivers of a stopped vehicle or an incident. One question says at least 45 metres (147 feet) behind on a two-way road. Do not use one on a motorway.',
    'high',
    'A warning triangle placed well back on the same side of a two-way road, with a note that it is not used on a motorway.',
    {
      example_en: 'On a two-way road you place the triangle at least 45 metres behind the breakdown. On a motorway you do not use it.',
      review_note:
        'AB2346 says "a bicycle in a red warning triangle". That is a triangular warning sign, not this breakdown triangle, so it is not linked.',
    }
  ),
  e(
    '999',
    ['999'],
    'The telephone number for the emergency services in the UK. The operator can also direct you to the nearest public defibrillator.',
    'medium',
    null
  ),
  e(
    'Helmet',
    ['helmet', 'helmets'],
    'The protective helmet worn by a motorcyclist. Leave it on an injured rider unless removing it is essential. Taking it off can make the injury worse.',
    'medium',
    'An injured motorcyclist with the helmet left on.'
  ),
  e(
    'First aid',
    ['first aid'],
    'Immediate help given to an injured person before the emergency services take over.',
    'low',
    null
  ),
  e(
    'Puncture',
    ['puncture', 'punctures'],
    'A hole that lets the air out of a tyre. On a motorway, stop on the hard shoulder or in an emergency area and get help. Do not try to change the wheel in moving traffic.',
    'medium',
    null
  ),
  e(
    'Breakdown',
    ['breakdown', 'broken down', 'breaks down'],
    'When a vehicle can no longer be driven. Warn other traffic. On a motorway, use the hard shoulder or an emergency area, and use the emergency telephone if you can.',
    'medium',
    'A broken-down car on the hard shoulder, with people stood well away behind the barrier.'
  ),
  e(
    'Emergency telephone',
    ['emergency telephone', 'emergency roadside telephone', 'roadside emergency telephone'],
    'A telephone beside a motorway. It is better than a mobile phone because the emergency services can tell where you are. Arrows on the marker posts point to the nearest one.',
    'high',
    'An orange motorway emergency telephone, with a marker-post arrow pointing towards it.'
  ),
  e(
    'Rejoin',
    ['rejoin the main carriageway', 'rejoin the carriageway', 'rejoin a motorway', 'rejoin the motorway', 'rejoin safely'],
    'To enter the moving lanes again after a stop. From an emergency area, use the telephone and follow the operator\'s advice. From the hard shoulder, build up speed on the shoulder, then join a safe gap in the left-hand lane.',
    'medium',
    'A car building speed on the hard shoulder before joining the left-hand lane.',
    { review_note: 'The phrase "rejoin your route" means finding the way again after a wrong turn, so it is not linked here.' }
  ),
  e(
    'Trailer',
    ['trailer', 'trailers'],
    'A vehicle with no engine, pulled by another vehicle. It changes the way the towing vehicle handles. On a three-lane motorway it is kept out of the right-hand lane except when lanes are closed, and the questions give a 60 mph restriction while towing.',
    'medium',
    'A car towing a trailer in the left lanes of a motorway.',
    { watch_coverage: true }
  ),
  e(
    'Caravan',
    ['caravan', 'caravans'],
    'A living trailer towed behind a car. Load it so it stays stable, and fit a stabiliser to the tow bar where that will help. It is kept out of the right-hand lane of a three-lane motorway except when lanes are closed.',
    'medium',
    'A car towing a caravan, with the load balanced over the caravan axles.'
  ),
  e(
    'Towing',
    ['towing', 'towing a trailer'],
    'Pulling a trailer or caravan. The combination is slower and less stable than the car alone. The questions give 60 mph for a car towing a trailer or caravan on a dual carriageway or motorway, and keep it out of the right-hand lane of a three-lane motorway except when lanes are closed.',
    'medium',
    'A car towing a trailer, staying out of the right-hand motorway lane.'
  ),
  e(
    'Tow bar',
    ['tow bar', 'tow hitch', 'tow ball'],
    'The fitting on the back of a car that connects to a trailer. A stabiliser can be fitted to it. The maximum noseweight for the hitch is in the vehicle handbook.',
    'high',
    'A tow bar and tow ball, with the trailer hitch lowered onto the ball.'
  ),
  e(
    'Noseweight',
    ['noseweight'],
    'The downward force of the trailer hitch on the tow ball. The maximum your vehicle may take is in the handbook. The hitch should press down on the ball, not lift it.',
    'high',
    'A trailer hitch pressing down on a tow ball, labelled as noseweight.'
  ),
  e(
    'Maximum authorised mass',
    ['maximum authorised mass', 'authorised mass', 'MAM'],
    'The heaviest a vehicle or trailer is allowed to be, including its load. The official question says a driver who has just passed may tow a trailer up to 3,500 kg MAM. A heavier trailer needs a further test.',
    'high',
    null
  ),
  e(
    'Unbraked trailer',
    ['unbraked trailer', 'unbraked'],
    'A trailer with no brakes of its own. Fit a secondary coupling, such as a safety chain, so it stays attached if the tow hitch fails.',
    'high',
    'An unbraked trailer with a safety chain between the trailer and the car.'
  ),
  e(
    'Breakaway cable',
    ['breakaway cable'],
    'A cable that applies the trailer brakes if the trailer becomes detached, then snaps so the towing vehicle can get clear.',
    'high',
    'A breakaway cable running from a trailer brake to the towing vehicle.'
  ),
  e(
    'Secondary coupling',
    ['secondary coupling', 'secondary coupling device'],
    'A safety chain or similar extra link. It keeps an unbraked trailer connected if the main tow hitch fails.',
    'high',
    'A secondary safety chain beside the main tow hitch.'
  ),
  e(
    'Stabiliser',
    ['stabiliser'],
    'A device fitted to the tow bar to give a car and caravan extra security in side winds and when large vehicles pass. It does not cure a snaking trailer that has been loaded badly.',
    'high',
    'A stabiliser fitted between a car\'s tow bar and a caravan.'
  ),
  e(
    'Snaking',
    ['snaking'],
    'A trailer weaving from side to side. Spread the load evenly and put heavy items over the axles to reduce the risk.',
    'high',
    'A trailer weaving behind a car, with heavy items placed over the trailer axles.'
  ),
  e(
    'Roof rack',
    ['roof rack'],
    'A frame or box fitted on the roof. It increases wind resistance and fuel consumption. Remove it when you are not using it.',
    'medium',
    'A roof rack on a car, shown as increasing wind resistance.'
  ),
  e(
    'Valuables',
    ['valuables'],
    'Items that attract a thief, such as a bag, phone or tools. If you must leave them in the car, lock them out of sight.',
    'low',
    null
  ),
  e(
    'Fuel consumption',
    ['fuel consumption', 'fuel-efficient'],
    'How much fuel the vehicle uses. Rapid acceleration, heavy braking, under-inflated tyres and a roof rack left on the car all increase it. Looking well ahead, so you do not need to brake sharply, uses less fuel and is described in one question as improving safety.',
    'medium',
    null
  ),
  e(
    'Exhaust emissions',
    ['exhaust emissions', 'emissions'],
    'Gases that leave the exhaust. Gentle acceleration and regular servicing help keep them cleaner. A catalytic converter reduces the poisonous gases.',
    'low',
    null
  ),
  e(
    'Long vehicle',
    ['long vehicle', 'long vehicles'],
    'A lorry, bus or other long vehicle. It may swing out before a turn so the rear wheels clear the kerb. Keep well back and do not try to squeeze into the gap.',
    'high',
    'A long lorry swinging out to the right before turning left, with a car staying back.'
  ),
  e(
    'Overtake',
    ['overtake', 'overtaking', 'overtaken'],
    'To pass a moving vehicle and pull back in ahead of it. Do it only when you can see that the road ahead is clear. Do not start if a dip, bend, junction or the vehicle in front hides the danger.',
    'high',
    'A car waiting behind another vehicle because a dip in the road hides oncoming traffic.',
    { watch_coverage: true }
  ),
  e(
    'Overtake on the left',
    ['overtake on the left'],
    'Passing another vehicle on its left side. The questions allow this in two cases only: a slow works vehicle shows a sign telling you to pass on its left, and you are in a queue while the traffic on your right is moving more slowly. It is not a general permission to pass on the left.',
    'high',
    'A works vehicle with a sign telling traffic to pass on the left.',
    {
      review_flag: true,
      review_concern: 'explanation',
      previous_explanation_en:
        'To pass on the left side of another vehicle. In the official question, a slow works vehicle shows a sign telling you to pass on its left. Follow the sign and pass with care.',
      review_note:
        'Both official cases are now in the explanation: the works-vehicle sign, and a queue moving faster than the lane on your right. Confirm that no other case has been added before import.',
    }
  ),
  e(
    'Emerging',
    ['emerging', 'emerge', 'emerged'],
    'Moving out from a side road, junction or driveway onto the road you want to join. Check the view, and on a dual carriageway make sure the central reservation can protect you.',
    'high',
    'A car emerging from a side road onto a main road.',
    { watch_coverage: true }
  ),
  e(
    'Oncoming traffic',
    ['oncoming traffic', 'oncoming'],
    'Traffic coming towards you. On a narrow bridge, bend or hump you may need to wait rather than try to pass it.',
    'medium',
    'Two vehicles approaching each other on a narrow road.',
    { watch_coverage: true }
  ),
  e(
    'Queuing traffic',
    ['queuing traffic', 'traffic queue'],
    'A line of vehicles moving very slowly or stopped close together. Motorcyclists may filter through it. At night, your brake lights can dazzle the driver behind if you sit on the footbrake.',
    'medium',
    'A queue of traffic at night, with one driver using the parking brake so the brake lights are off.'
  ),
  e(
    'Obstruction',
    ['obstruction', 'obstructions'],
    'Something that blocks the road or a driver\'s view. A broken-down vehicle or a badly parked car can be an obstruction. Windscreen pillars can also obstruct your view at bends and junctions.',
    'medium',
    null
  ),
  e(
    'Vulnerable road users',
    ['vulnerable road users', 'vulnerable road user', 'vulnerable', 'older people'],
    'People who are more easily hurt because they have little protection, including pedestrians, cyclists, motorcyclists, horse riders and older people. Older people may need more time to cross. Do not get close to them or rev the engine. Traffic calming is used to slow vehicles near vulnerable road users.',
    'high',
    'Pedestrians, a cyclist, a motorcyclist and a horse rider sharing a road with cars.'
  ),
  e(
    'Horse',
    ['horse and rider', 'horse rider', 'horse riders', 'horses', 'horse'],
    'A horse on the road, with or without a rider. Horses are easily startled. Pass slowly, leave plenty of room, and be ready to use the other side of the road.',
    'high',
    'A driver passing a horse and rider slowly and leaving a wide gap.',
    { review_note: 'Horse, horses and horse rider are one road-user concept in this bank.' }
  ),
  e(
    'Motorcyclist',
    ['motorcyclist', 'motorcyclists'],
    'A person riding a motorcycle. Riders are smaller than cars and easy to miss at junctions. In a slow queue they may filter past on either side. Look before you turn or change lane.',
    'medium',
    null
  ),
  e(
    'Moped',
    ['moped', 'mopeds'],
    'A small, low-powered two-wheeler. Like a motorcycle, it is harder to see than a car. Bright clothing makes the rider easier to notice.',
    'medium',
    'A moped rider wearing bright clothing.'
  ),
  e(
    'Filtering',
    ['filtering'],
    'When a motorcyclist moves between lanes of slow or stationary traffic. Check your mirrors and blind spots before you change lane or direction.',
    'high',
    'A motorcyclist filtering between two lanes of queuing cars.'
  ),
  e(
    'Nearside',
    ['nearside'],
    'The side of the vehicle nearest the kerb. In the UK that is the left, the passenger side of a right-hand-drive car. Cyclists often filter past on the nearside of a queue.',
    'high',
    'A right-hand-drive car with the nearside (left) and offside (right) labelled.',
    { example_en: 'Before you turn left, you check your nearside for a cyclist.' }
  ),
  e(
    'Offside',
    ['offside'],
    'The driver\'s side of a right-hand-drive car, nearest the centre of the road. Turning offside to offside means passing an oncoming vehicle so that the drivers\' sides pass each other, which can give a clearer view.',
    'high',
    'Two cars turning right at a crossroads, passing offside to offside.'
  ),
  e(
    'U-turn',
    ['U-turn', 'U-turns'],
    'A turn that takes you back the way you came. Slow down, make sure the road is clear in both directions and wide enough, and look over your shoulder before you turn across the road.',
    'high',
    'A car making a U-turn, with the driver looking over their shoulder.'
  ),
  e(
    'Reversing',
    ['reversing', 'reverse gear', 'reverse'],
    'Driving backwards. You may undo your seat belt while a manoeuvre includes reversing, then put it on again before you drive on. Look all around, because your view is limited. On a motorway it is illegal to reverse, to cross the central reservation, or to drive against the traffic flow.',
    'medium',
    'A driver looking around before reversing.'
  ),
  e(
    'Manoeuvre',
    ['manoeuvre', 'manoeuvres'],
    'A planned movement such as turning, reversing, parking or moving off. Check the mirrors and blind spots before you start, and signal if it will help others.',
    'medium',
    null
  ),
  e(
    'Anticipation',
    ['anticipation', 'anticipate'],
    'Reading the road early, so you have time to slow down or change position before a hazard reaches you.',
    'medium',
    null
  ),
  e(
    'Observation',
    ['observation'],
    'Looking carefully all around, including the areas your mirrors do not cover, before you move. At a blind junction you may have to stop and edge forward before you can see.',
    'medium',
    'A driver stopped at a line, then edging forward to see past a wall.'
  ),
  e(
    'Mirrors',
    ['mirrors', 'mirror'],
    'The interior mirror and the door mirrors. Check them before you signal, change speed or change direction, then look for what they cannot show.',
    'medium',
    null,
    { watch_coverage: true }
  ),
  e(
    'Horn',
    ['horn', 'horns'],
    'A warning that you are there. Use it to alert other road users, not to greet someone or show impatience. In a built-up area you must not use it between 11:30 pm and 7 am, or when you are stationary, unless a moving vehicle is a danger.',
    'medium',
    'A horn control on a steering wheel.',
    { example_en: 'A hidden driver starts to reverse. You sound the horn to warn them, and you are ready to stop.' }
  ),
  e(
    'Left-hand lane',
    ['left-hand lane'],
    'The leftmost lane in the direction you are travelling. On a motorway you rejoin into this lane, and slow vehicles usually stay here.',
    'high',
    'A three-lane motorway with the left-hand lane labelled.'
  ),
  e(
    'Right-hand lane',
    ['right-hand lane'],
    'The rightmost lane in the direction you are travelling. Vehicles towing a trailer are not allowed to use it on a three-lane motorway except when lanes are closed.',
    'high',
    'A three-lane motorway with the right-hand lane labelled.'
  ),
  e(
    'Middle lane',
    ['middle lane'],
    'The centre lane of a three-lane carriageway.',
    'medium',
    'A three-lane motorway with the middle lane labelled.'
  ),
  e(
    'Gantry',
    ['gantry', 'overhead gantry'],
    'A structure over a motorway that carries signals and speed limits for the lanes. You must stop if a red cross is shown above every lane.',
    'medium',
    'An overhead gantry with a speed limit and lane signals.'
  ),
  e(
    'Bunching',
    ['bunching'],
    'Traffic forming tight groups with short gaps. Variable speed limits on motorways are used to reduce it.',
    'medium',
    'Tight packs of vehicles on a motorway, then the same traffic more evenly spaced.'
  ),
  e(
    'Steep hill',
    ['steep hill', 'steep gradient', 'gradient'],
    'A sharp slope. A crawler lane may be provided uphill for slow vehicles. Downhill, a lower gear helps you control speed without overheating the brakes.',
    'medium',
    'A steep hill warning sign, read from left to right to see whether the slope is up or down.',
    { review_note: 'Confirm "gradient" is a hill, not another measurement.' }
  ),
  e(
    'Downhill',
    ['downhill'],
    'A slope that goes down in the direction you are travelling. Select a lower gear so the engine helps to hold your speed and the brakes do not fade.',
    'medium',
    'A downhill warning sign and a car in a lower gear.'
  ),
  e(
    'Bright clothing',
    ['bright clothing', 'reflective clothing'],
    'Clothing that is easy to see. Motorcyclists wear it so other people notice them, especially at junctions and in poor light.',
    'medium',
    'A rider in a bright jacket.'
  ),
  e(
    'Powered vehicle used by a disabled person',
    ['powered vehicles used by disabled', 'powered mobility', 'mobility scooter'],
    'A small, low, slow vehicle used by a disabled person, including a mobility scooter. It is hard to see. On an unrestricted dual carriageway it must show a flashing amber beacon.',
    'high',
    'A mobility scooter with a flashing amber beacon.'
  ),
  e(
    'Wheelchair',
    ['wheelchair', 'wheelchairs'],
    'A chair on wheels used by a person who cannot walk. Give them time and room. They can be harder to see than a car.',
    'low',
    'A person using a wheelchair at the side of the road.'
  ),
  e(
    'Tractor',
    ['tractor'],
    'A slow farm vehicle. Be patient behind it, and overtake only when you can see that the road is clear.',
    'low',
    'A tractor travelling slowly on a country road.'
  ),
  e(
    'Sheep',
    ['sheep'],
    'Farm animals that may be on or beside the road. Slow down and be prepared to stop.',
    'low',
    'Sheep on a country road.'
  ),
  e(
    'Lorry',
    ['lorry', 'lorries'],
    'The usual British word for a large goods vehicle. In other countries the same vehicle may be called a truck.',
    'high',
    'A lorry on a road, labelled as the British word for a large goods vehicle.',
    { watch_coverage: true }
  ),
  e(
    'Heavy goods vehicle',
    ['heavy goods vehicle', 'heavy goods vehicles'],
    'A large goods vehicle. It may need extra room and steer the opposite way before a turn, so keep well back and do not pass on the inside. Reflective markers must be fitted to heavy goods vehicles, to vehicles over 13 metres long, and to rubbish skips placed in the road, so they are easier to see in the dark.',
    'high',
    'Reflective markers on a long heavy goods vehicle, and the vehicle swinging out before a left turn.'
  ),
  e(
    'Side road',
    ['side road', 'side roads'],
    'A smaller road that joins a larger road.',
    'high',
    'A side road joining a main road, with both roads labelled.',
    { watch_coverage: true }
  ),
  e(
    'Main road',
    ['main road'],
    'The larger through road that a side road joins.',
    'medium',
    'A main road with a smaller side road joining it, both labelled.',
    { watch_coverage: true }
  ),
  e(
    'Following too closely',
    ['too close to the vehicle ahead', 'follow this vehicle too closely', 'following too closely', 'follows the vehicle in front too closely', 'follow the vehicle in front too closely', 'too close to the vehicle in front'],
    'Driving with too small a gap behind the vehicle in front. It restricts your view of the road ahead. If someone follows you too closely, gradually increase the gap in front of you.',
    'high',
    'Two cars with too small a gap, and the same cars after the gap has been increased.'
  ),
  e(
    'Shared route',
    ['shared route', 'route for pedestrians and cyclists'],
    'A path signed for both pedestrians and cyclists. When the shared route ends, cyclists are likely to rejoin the main road.',
    'high',
    'A sign showing a shared route for pedestrians and cyclists.'
  ),
  e(
    'Cycle route',
    ['cycle route ahead', 'cycle routes'],
    'A signed route provided for cyclists. The warning sign means one is ahead. Give cyclists plenty of room if you need to pass them.',
    'high',
    'A cycle-route-ahead warning sign.'
  ),
  e(
    '20 mph zone',
    ['20 mph zone', '20 mph restriction'],
    'An area with a 20 mph speed limit. The end sign means that restriction has finished and a 30 mph restriction starts. Look all around before you increase speed.',
    'high',
    'The sign that marks the end of a 20 mph zone.'
  ),
  e(
    'Waiting restrictions',
    ['waiting restrictions'],
    'Rules about when you must not wait or park. A plate or another sign tells you when they apply.',
    'medium',
    'A waiting-restriction sign with a time plate.'
  ),
  e(
    'Tourist directions',
    ['tourist directions', 'tourist attraction', 'places of interest', 'brown background'],
    'Signs that direct you to places of interest, often by the easiest route. A brown background is used for these signs. They help when you do not know the area.',
    'medium',
    'A brown direction sign pointing to a tourist attraction.'
  ),
  e(
    'Water across the road',
    ['water across the road', 'shallow stream'],
    'A warning where a shallow stream crosses the road. Heavy rain can make the water deeper or wider. If it looks too deep, or the stream has spread a long way, stop and find another route.',
    'high',
    'The warning sign for water across the road, beside a shallow stream crossing the carriageway.'
  ),
  e(
    'Ring road',
    ['ring road', 'ring roads'],
    'A road around a town or city centre, designed to relieve congestion in the centre.',
    'medium',
    'The direction sign for a ring road.'
  ),
  e(
    'Double white lines',
    ['double white lines along the centre', 'road marked with double white lines'],
    'White lines along the centre of the road that may both be solid, or one may be broken. You must not park or stop on a road marked with them, even where one line is broken, except to pick up or set down passengers.',
    'high',
    'Double white lines in the centre of the road, one of them broken, with a car stopped only to set down a passenger.',
    {
      review_flag: true,
      review_concern: 'mapping',
      previous_explanation_en:
        'Pairs of white lines along the centre of the road. They may both be solid, or one may be broken. You must not park or stop on a road marked with them except to pick up or set down passengers.',
      review_note:
        'AB2528 states the parking rule, including where one line is broken. AB2007 and BB1236 use "double white lines" for the path past hatch markings and for where you return after overtaking. Those two questions are no longer linked. Confirm that split before import.',
    }
  ),
  e(
    'No motorcycles',
    ['no motorcycles'],
    'A sign that means motorcycles must not use that road. You must obey signs that apply to the type of vehicle you are using.',
    'high',
    'A circular sign meaning no motorcycles.'
  ),
  e(
    'Deaf pedestrian',
    ['pedestrian is deaf', 'yellow or burgundy coat'],
    'A person who may not hear traffic or a horn. A dog trained to help a deaf person has a yellow or burgundy coat. Take extra care, because the person may not notice vehicles approaching.',
    'high',
    'A pedestrian with a dog wearing a yellow or burgundy coat.'
  ),
  e(
    'Shock',
    ['suffering from shock', 'warning sign for shock', 'effects of shock'],
    'A medical reaction after an injury. The questions list a rapid pulse, sweating, pale skin, and rapid shallow breathing. Keep the person warm and comfortable, do not give them anything to eat or drink, reassure them, and try not to leave them alone.',
    'high',
    null,
    {
      review_flag: true,
      review_concern: 'terminology',
      previous_explanation_en:
        'A medical reaction after injury or a frightening event. Warning signs include a rapid pulse, sweating, pale skin, and rapid shallow breathing. Keep the person warm and comfortable, do not give them anything to eat or drink, reassure them, and try not to leave them alone.',
      review_note:
        'This is medical shock. It is kept separate from the electric shock given by a defibrillator. The aliases are full phrases so the defibrillator questions are not linked. "Frightening event" was removed because the questions do not use it.',
    }
  ),
  e(
    'Sat nav',
    ['sat nav', 'sat navs', 'satellite navigation'],
    'A satellite navigation device. It can help on an unfamiliar route, but looking at it or changing it while you drive can distract you. Set it before you start, or pull up in a safe place first.',
    'high',
    'A sat nav being set while the car is still parked.'
  ),
  e(
    'Medicine',
    ['medicine', 'cough medicine'],
    'A treatment, including cough medicine from someone else and prescribed medicine. Some medicines make you drowsy or unfit to drive. Check the label or leaflet before you drive.',
    'high',
    null
  ),
  e(
    'Park-and-ride',
    ['park-and-ride'],
    'A scheme that lets you park in a set area and travel by bus into the town centre. It is used to ease congestion and is usually cheaper and easier than parking in the centre.',
    'medium',
    'A sign directing traffic to a park-and-ride car park.'
  ),
  e(
    'Pulls to one side',
    ['pulls to one side'],
    'The vehicle steers itself left or right when you brake. The brakes must be effective and properly adjusted, so have them checked by a qualified mechanic as soon as you can.',
    'medium',
    null
  ),
  e(
    'Soft road surface',
    ['becomes soft', 'can soften'],
    'A road surface that softens in very hot weather. Tyres cannot grip it as well as a firm, dry surface. Take care when cornering and braking.',
    'medium',
    null
  ),
  e(
    'Snow',
    ['snowy', 'fall of snow', 'on snow', 'deep snow'],
    'Snow on the road. A higher gear than normal can help you move off, because a low gear puts more turning force through the wheels and makes wheelspin more likely. Do not brake sharply. Wheel chains can help in snowy conditions. Do not travel unless the journey is essential.',
    'high',
    'A car moving off in snow, with the wheels gripping rather than spinning.'
  ),
  e(
    'Ice and snow on the vehicle',
    ['clear of ice and snow'],
    'Ice or snow stuck to the vehicle. Clear it from the mirrors, number plates and windows before you drive, so you can see and be seen.',
    'high',
    'A driver clearing ice and snow from the windows, mirrors and number plate.'
  ),
  e(
    'Vehicle battery',
    ['vehicle battery'],
    'A battery that contains acid. It is hazardous and must be disposed of safely at an appropriate site, such as a local authority disposal site.',
    'medium',
    null
  ),
  e(
    'Overloaded',
    ['overloaded'],
    'Carrying more weight than the vehicle should. A heavy load affects control and handling, and the driver is responsible for making sure the vehicle is not overloaded.',
    'medium',
    null
  ),
  e(
    'Tyre burst',
    ['tyre bursts'],
    'A tyre that fails suddenly while you are driving. It can make you lose control, especially at high speed. The official answer is to pull up slowly at the side of the road.',
    'high',
    null
  ),
  e(
    'Smell of fuel',
    ['smell of fuel', 'catching fire'],
    'A warning that fuel may be escaping. Fuel can start a fire. Find out where the smell is coming from. Do not use a naked flame near the vehicle if you can smell fuel, and do not smoke when refuelling.',
    'medium',
    null
  ),
  e(
    'Inexperienced driver',
    ['inexperienced'],
    'A driver with little experience, including a learner who is not yet confident. Be patient, give them room, and expect them to react more slowly.',
    'medium',
    null
  ),
  e(
    'Missing out gears',
    ['missing out some gears', 'missing out intermediate gears'],
    'Changing gear by skipping an intermediate gear, when it is appropriate. This reduces the time spent accelerating and decelerating, which is when the vehicle uses the most fuel.',
    'medium',
    null
  ),
  e(
    'Suitable shoes',
    ['suitable shoes'],
    'Shoes that let you feel and control the pedals. Wear them whenever you drive.',
    'low',
    null
  ),
  e(
    'Stop at the scene of the incident',
    ['stop at the scene of the incident', 'by law you must stop', 'name, address and vehicle registration number', 'report the incident to the police within 24 hours'],
    'If a collision causes damage or injury to a person, vehicle, animal or property, you must stop. Give your name, the vehicle owner\'s name and address, and the registration number to anyone with reasonable grounds to ask. If another vehicle is damaged, share your name, address and registration number before you leave. If you damage property and the owner is not there, tell the police as soon as possible, and within 24 hours.',
    'high',
    null,
    {
      review_flag: true,
      review_concern: 'explanation',
      review_note: 'One card groups three official duties: stop, share details, and report property damage to the police within 24 hours. Split them if a reviewer wants separate cards.',
    }
  ),
  e(
    'Etched registration number',
    ['etching the registration number', 'etched on all your windows'],
    'The vehicle\'s registration number cut into the windows. It is a cheap way to deter professional thieves.',
    'low',
    null
  ),
  e(
    'Security-coded radio',
    ['security-coded radio'],
    'A radio that is of little use after it is removed from the vehicle, so it is less attractive to a thief.',
    'low',
    null
  ),
  e(
    'Police stop signal',
    ['signal for you to stop', 'flashes the headlights and points to the left'],
    'An order to pull over from a police officer in a patrol vehicle. They flash the headlights, indicate left and point to the left. Pull up on the left as soon as it is safe, and switch off the engine.',
    'high',
    'A police car flashing its headlights, indicating left and pointing left, while a driver pulls up on the left.',
    {
      label_origin: 'editorial_label',
      review_flag: true,
      review_concern: 'terminology',
      review_note: 'The bank describes the signal and does not use the name "police stop signal". Confirm the label before import.',
    }
  ),
];

export const EDITORIAL_PATTERNS: EditorialPattern[] = [
  {
    term_en: 'Blind spot',
    phrases: ['look over your shoulder'],
    note: 'The official wording asks for a shoulder check and does not use the words blind spot. Linked only when those words are absent.',
  },
];

export function assertLexicon(entries: LexiconEntry[] = KEYWORD_LEXICON): void {
  const terms = new Set<string>();
  const aliases = new Set<string>();
  for (const entry of entries) {
    const term = entry.term_en.trim().replace(/\s+/g, ' ').toLowerCase();
    if (!term) throw new Error('Empty lexicon term');
    if (terms.has(term)) throw new Error(`Duplicate canonical term: ${entry.term_en}`);
    terms.add(term);
    if (!entry.explanation_en.trim()) throw new Error(`Empty explanation: ${entry.term_en}`);
    if (!entry.aliases.length) throw new Error(`No aliases: ${entry.term_en}`);
    if (entry.label_origin === 'editorial_label' && !entry.review_flag) {
      throw new Error(`Editorial label must be flagged: ${entry.term_en}`);
    }
    for (const alias of entry.aliases) {
      const key = alias.trim().replace(/\s+/g, ' ').toLowerCase();
      if (!key) throw new Error(`Empty alias on ${entry.term_en}`);
      if (aliases.has(key)) throw new Error(`Alias used twice: ${alias}`);
      aliases.add(key);
    }
  }
  for (const pattern of EDITORIAL_PATTERNS) {
    if (!entries.some((entry) => entry.term_en === pattern.term_en)) {
      throw new Error(`Editorial pattern missing keyword: ${pattern.term_en}`);
    }
    for (const phrase of pattern.phrases) {
      const key = phrase.trim().replace(/\s+/g, ' ').toLowerCase();
      if (aliases.has(key)) throw new Error(`Editorial phrase duplicates an alias: ${phrase}`);
    }
  }
}
