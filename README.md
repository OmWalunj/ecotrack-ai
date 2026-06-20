# EcoTrack AI

Live Demo: https://github.com/OmWalunj/EcoTrack-AI/

## Chosen Vertical

Sustainability and Environmental Awareness

## Problem Statement

Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

## Approach and Logic

EcoTrack AI helps users estimate their carbon footprint based on daily lifestyle choices such as transportation methods, electricity consumption, food preferences, and flight frequency.

The application calculates a carbon impact score and classifies users into Low, Medium, or High impact categories. Based on the score, the system generates personalized recommendations and sustainability goals to help users reduce their environmental impact.

Additional engagement features such as Green Points, Achievement Badges, Weekly Eco Challenges, and Carbon Savings Tracking encourage users to adopt eco-friendly habits.

## How the Solution Works

1. User enters profile and lifestyle information.
2. The application calculates an estimated carbon footprint.
3. A carbon impact score is generated.
4. The user is categorized as:

   * Low Impact
   * Medium Impact
   * High Impact
5. Personalized recommendations are displayed.
6. Green Points and badges are awarded for sustainable choices.
7. Previous calculations are stored using localStorage.
8. Users can track progress and view sustainability insights.

## Technologies Used

* HTML
* CSS
* JavaScript
* Local Storage

## Features

* Carbon Footprint Calculator
* Carbon Impact Scoring
* Personalized Action Plans
* AI Eco Assistant
* Green Points System
* Achievement Badges
* Weekly Eco Challenges
* Carbon Savings Counter
* Progress Tracking Dashboard
* Responsive User Interface

## Testing

### Test Case 1

Input:

* Travel: Walking
* Food: Vegetarian
* Flights: 0

Expected Result:
Low Carbon Impact

Status:
Passed

### Test Case 2

Input:

* Travel: Car
* High Electricity Usage
* Flights: 5

Expected Result:
High Carbon Impact

Status:
Passed

### Test Case 3

Input:

* Travel: Bus
* Moderate Electricity Usage
* Flights: 1

Expected Result:
Medium Carbon Impact

Status:
Passed

## Assumptions Made

* Carbon emission values are estimated and simplified for demonstration purposes.
* User inputs are assumed to be accurate.
* Data is stored locally in the browser using localStorage.
* Internet connectivity is not required after the application loads.
* Sustainability recommendations are based on predefined environmental best practices.

## Future Enhancements

* Real AI-powered sustainability recommendations
* Carbon footprint analytics and reports
* Cloud synchronization
* Community sustainability challenges
* Integration with external environmental APIs

## Application Screenshots

### Dashboard

<img width="1900" height="917" alt="Dashboard" src="https://github.com/user-attachments/assets/25a5692d-9e0b-4c18-b24f-45798769f9ae" />

### Carbon Footprint Result

<img width="1902" height="900" alt="Carbon Calculator" src="https://github.com/user-attachments/assets/0853da7b-c618-4828-928b-139e18098e30" />

### Personalized Recommendations

<img width="1907" height="922" alt="AI Assistant" src="https://github.com/user-attachments/assets/be66fdb0-79a0-4725-bfcb-d6499eb85faf" />

### AI Object Vision

<img width="1897" height="905" alt="AI object vision" src="https://github.com/user-attachments/assets/4749bc62-a5da-4f8d-a283-82f2ccf2205a" />

### Progress History

<img width="1897" height="911" alt="Track Logs" src="https://github.com/user-attachments/assets/577b74bf-0dc7-4876-be50-6afc57becda5" />
