<?xml version="1.0"?>
<xsl:transform version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
   xmlns:n3="http://www.w3.org/1999/xhtml" xmlns:n1="urn:hl7-org:v3" xmlns:n2="urn:hl7-org:v3/meta/voc"
   xmlns:voc="urn:hl7-org:v3/voc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <xsl:output method="html" indent="yes" version="4.01" encoding="ISO-8859-1"
      doctype-public="-//W3C//DTD HTML 4.01//EN" />

   <!-- CDA document -->

   <xsl:variable name="tableWidth">50%</xsl:variable>

   <xsl:variable name="title">
      <xsl:choose>
         <xsl:when test="/n1:ClinicalDocument/n1:title">
            <xsl:value-of select="/n1:ClinicalDocument/n1:title" />
         </xsl:when>
         <xsl:otherwise>Clinical Document</xsl:otherwise>
      </xsl:choose>
   </xsl:variable>

   <xsl:template match="/">
      <xsl:apply-templates select="n1:ClinicalDocument" />
   </xsl:template>

   <xsl:template match="n1:ClinicalDocument">
      <html>
         <head>
            <!-- <meta name='Generator' content='&CDA-Stylesheet;'/> -->
            <xsl:comment>
                        Do NOT edit this HTML directly, it was generated via an XSLt
                        transformation from the original release 2 CDA Document.
                </xsl:comment>
            <title>
               <xsl:value-of select="$title" />
            </title>
         </head>
         <xsl:comment>				
              Derived from HL7 Finland R2 Tyylitiedosto: Tyyli_R2_B3_01.xslt
	      Updated by   Calvin E. Beebe,   Mayo Clinic - Rochester Mn.
            </xsl:comment>
         <body>

            <h2 align="center">
               <xsl:value-of select="$title" />
            </h2>
            <table width="100%">
               <tr>
                  <td width="10%">
                     <big>
                        <b>
                           <xsl:text>Patient: </xsl:text>
                        </b>
                     </big>
                  </td>
                  <td width="40%">
                     <big>
                        <xsl:call-template name="getName">
                           <xsl:with-param name="name"
                              select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:name"
                            />
                        </xsl:call-template>
                     </big>
                  </td>
                  <td width="25%" align="right">
                     <b>
                        <xsl:text>MRN: </xsl:text>
                     </b>
                  </td>
                  <td width="25%">
                     <xsl:value-of
                        select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:id/@extension" />
                  </td>
               </tr>

               <tr>
                  <td width="10%">
                     <b>
                        <xsl:text>Birthdate: </xsl:text>
                     </b>
                  </td>
                  <td width="40%">
                     <xsl:call-template name="formatDate">
                        <xsl:with-param name="date"
                           select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:birthTime/@value"
                         />
                     </xsl:call-template>
                  </td>
                  <td width="25%" align="right">
                     <b>
                        <xsl:text>Sex: </xsl:text>
                     </b>
                  </td>
                  <td width="25%">
                     <xsl:variable name="sex"
                        select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:administrativeGenderCode/@code" />
                     <xsl:choose>
                        <xsl:when test="$sex='M'">Male</xsl:when>
                        <xsl:when test="$sex='F'">Female</xsl:when>
                     </xsl:choose>
                  </td>
               </tr>

            </table>
            <br />
         </body>
      </html>
   </xsl:template>

   <!-- Get a Name  -->
   <xsl:template name="getName">
      <xsl:param name="name" />
      <xsl:choose>
         <xsl:when test="$name/n1:family">
            <xsl:value-of select="$name/n1:given" />
            <xsl:text> </xsl:text>
            <xsl:value-of select="$name/n1:family" />
            <xsl:text> </xsl:text>
            <xsl:if test="$name/n1:suffix">
               <xsl:text>, </xsl:text>
               <xsl:value-of select="$name/n1:suffix" />
            </xsl:if>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="$name" />
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>

   <!--  Format Date 
    
      outputs a date in Month Day, Year form
      e.g., 19991207  ==> December 07, 1999
-->
   <xsl:template name="formatDate">
      <xsl:param name="date" />
      <xsl:variable name="month" select="substring ($date, 5, 2)" />
      <xsl:choose>
         <xsl:when test="$month='01'">
            <xsl:text>January </xsl:text>
         </xsl:when>
         <xsl:when test="$month='02'">
            <xsl:text>February </xsl:text>
         </xsl:when>
         <xsl:when test="$month='03'">
            <xsl:text>March </xsl:text>
         </xsl:when>
         <xsl:when test="$month='04'">
            <xsl:text>April </xsl:text>
         </xsl:when>
         <xsl:when test="$month='05'">
            <xsl:text>May </xsl:text>
         </xsl:when>
         <xsl:when test="$month='06'">
            <xsl:text>June </xsl:text>
         </xsl:when>
         <xsl:when test="$month='07'">
            <xsl:text>July </xsl:text>
         </xsl:when>
         <xsl:when test="$month='08'">
            <xsl:text>August </xsl:text>
         </xsl:when>
         <xsl:when test="$month='09'">
            <xsl:text>September </xsl:text>
         </xsl:when>
         <xsl:when test="$month='10'">
            <xsl:text>October </xsl:text>
         </xsl:when>
         <xsl:when test="$month='11'">
            <xsl:text>November </xsl:text>
         </xsl:when>
         <xsl:when test="$month='12'">
            <xsl:text>December </xsl:text>
         </xsl:when>
      </xsl:choose>
      <xsl:choose>
         <xsl:when test="substring ($date, 7, 1)=&quot;0&quot;">
            <xsl:value-of select="substring ($date, 8, 1)" />
            <xsl:text>, </xsl:text>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="substring ($date, 7, 2)" />
            <xsl:text>, </xsl:text>
         </xsl:otherwise>
      </xsl:choose>
      <xsl:value-of select="substring ($date, 1, 4)" />
   </xsl:template>

   <!--   Title  -->
   <xsl:template match="n1:title">
      <h3>
         <span style="font-weight:bold;">
            <xsl:value-of select="." />
         </span>
      </h3>
   </xsl:template>

   <!--   Text   -->
   <xsl:template match="n1:text">
      <xsl:apply-templates />
   </xsl:template>



 
</xsl:transform>
