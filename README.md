# SNMP_AfintiTest
Solution for task to set up an SNMP agent along with custom enterprise OIDs on a Linux server to be monitored.

## Design

I didn't had any previous knowledge about SNMP Protocol nor any prior experience working on it. The hardest part of this task was to understand deeply, how SNMP actually works behind the scenes. So, it took me almost 6-7 hours of research to understand how SNMP works, what is MIB and OIDs etc.
After the research, I decided to extend the 'net-snmp' module to add sub-agents to expose custom enterprise OIDs. This module is available in many programming languages. My choice for the solution was JavaScript due to several reasons.
1) JavaScript have a strong community support, you can find the solutions to your problems if you get stuck somewhere.
2) 'net-snmp' package for JavaScript was available to work with. 
3) I have vast experience working with JavaScript and I find it pretty comfortable to code in JavaScript.
Although, JavaScript is not the best choice for solving this problem, as compared to some languages such as C, C++ and Shell. But in our case, we can barely see any difference due to the language.  
