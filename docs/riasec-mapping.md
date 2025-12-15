# RIASEC Mapping

## Introduction to RIASEC and Its Use in Study Field Matching

The **RIASEC model**, also known as the Holland Codes, is a widely recognized framework for categorizing people’s interests and personality traits into six types: **Realistic, Investigative, Artistic, Social, Enterprising, Conventional**.
It is widely used in career and educational guidance to identify areas that match a person’s strengths and preferences.

In the context of our application, we assign each degree programme a **RIASEC profile** with scores from 1 to 5 for each type, based on typical activities and skills.
This allows us to match programmes to the individual preferences and interests of a user in a structured, consistent way.

## Mapping Process

The following mapping process is a combination of manuel and automatic mapping. Due to the limited amount of information available about the degree programs, a mapping with an integrated AI is not possible (external information sourcing would be necessary). In order to make the application as maintainable as possible, mapping is carried out using the areas of study. These rarely change, and degree programs are subordinate to them. This means that when new degree programs are added, adaptation is no problem.

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
3. Calculate the arithmetic mean of the RIASEC types for all disciplines in a degree program in order to obtain the scores for the degree programs

## RIASEC Determination

The scoring process is based on a checklist of characteristics for each RIASEC type. Each checkbox corresponds to a feature commonly found in the study area. The total number of checked boxes determines the score (1–5) for that type. This systematic approach ensures consistency, transparency, and ease of maintenance, allowing new study fields to be added or updated without disrupting the framework.

**Example**: If you check 1 box under Realistic, the score is R = 1. Maximum score is 5.

### R - Realistic

- [ ] Practical work or manual tasks
- [ ] Laboratory, machinery, or technical equipment
- [ ] Engineering or craftsmanship activities
- [ ] Agricultural work
- [ ] Producing tangible, visible results

### I - Investigative

- [ ] Analytical work, theory, or research
- [ ] Mathematics, natural sciences, or technical analysis
- [ ] Problem solving and model building
- [ ] Experimentation and hypothesis testing
- [ ] Critical thinking and data interpretation

### A - Artistic

- [ ] Creative production (art, music, writing)
- [ ] Design, visual arts, or digital media
- [ ] Originality and innovation
- [ ] Open-ended problem solving
- [ ] Conceptual or aesthetic exploration

### S - Social

- [ ] Counseling or psychological support
- [ ] Education or teaching
- [ ] Healthcare or caregiving
- [ ] Teamwork and collaboration
- [ ] Communication and social engagement

### E - Enterprising

- [ ] Entrepreneurship or starting initiatives
- [ ] Leadership or management
- [ ] Organization and planning
- [ ] Influencing or persuading others
- [ ] Taking responsibility for projects

### C - Conventional

- [ ] Office or administrative work
- [ ] Data management or routine processes
- [ ] Compliance with rules, laws, or regulations
- [ ] Systematic record keeping
- [ ] Standardized procedures and documentation
