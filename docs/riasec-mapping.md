# RIASEC Mapping

## Introduction to RIASEC and Its Use in Study Field Matching

The **RIASEC model**, also known as the Holland Codes, is a widely recognized framework for categorizing people’s interests and personality traits into six types: **Realistic, Investigative, Artistic, Social, Enterprising, Conventional**.
It is widely used in career and educational guidance to identify areas that match a person’s strengths and preferences.

In the context of our application, we assign each degree programme a **RIASEC profile** with scores from 1 to 5 for each type, based on typical activities and skills.
This allows us to match programmes to the individual preferences and interests of a user in a structured, consistent way.

## Mapping Process

The following mapping process is a combination of manual and automatic mapping. Due to the limited amount of information available about the degree programmes, a mapping with an integrated AI is not possible (external information sourcing would be necessary). In order to make the application as maintainable as possible, mapping is carried out using the areas of study. These rarely change, and degree programmes are subordinate to them. This means that when new degree programmes are added, adaptation is no problem.

### Initial Data Situation

- 70 **areas of study**
- 239 **disciplines** - each assigned to one area of study
- 2206 **degree programmes** - may have multiple disciplines -> currently 1-6 per degree programme

### Procedure

1. RIASEC mapping with areas of study (broad categories)
   - Each receives 6 RIASEC values between 1-5
2. Fine-tuning with disciplines
   - Automatically inherit the values of the associated area of study
   - Individual values can be overwritten if necessary
3. Calculate the arithmetic mean of the RIASEC types for all disciplines in a degree programme in order to obtain the scores for the degree programmes

## RIASEC Determination

To evaluate areas of study using the RIASEC model, each type is scored on a scale from **1 to 5**:

- 1 – The type does not apply at all
- 5 – The type matches completely

The RIASEC types represent different interests and strengths:

### R - Realistic

_Practical, manual, technical, mechanical, or agricultural activities with visible results._

### I - Investigative

_Analytical, research, scientific activities; solving complex or theoretical problems._

### A - Artistic

_Creative expression through art, music, language, design_

### S - Social

_Helping, teaching, advising, social interaction, empathy_

### E - Enterprising

_Lead, persuade, sell, organize, act entrepreneurially_

### C - Conventional

_Structured, bureaucratic, organizational activities with clear guidelines_
