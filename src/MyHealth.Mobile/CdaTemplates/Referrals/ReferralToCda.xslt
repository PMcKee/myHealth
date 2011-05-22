<!--<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
>
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="@* | node()">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
-->

<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:t="http://test.com"
  exclude-result-prefixes="t"
  version="1.0">

	<xsl:output method="xml" indent="yes"/>

	<xsl:param name="f2" select="'test2010050503.xml'"/>
	<xsl:param name="f3" select="'test2010050504.xml'"/>

	<xsl:variable name="doc2" select="document($f2)"/>
	<xsl:variable name="doc3" select="document($f3)"/>

	<xsl:key name="k1" match="t:Response/t:Result/t:info" use="t:id"/>

	<xsl:template match="t:Response/t:Result/t:List">
		<Row>
			<xsl:variable name="tid" select="t:typeid"/>
			<xsl:for-each select="$doc2">
				<xsl:apply-templates select="key('k1', $tid)/t:rfs"/>
			</xsl:for-each>
			<xsl:variable name="vid" select="t:valueid"/>
			<xsl:for-each select="$doc3">
				<xsl:apply-templates select="key('k1', $vid)/t:code"/>
			</xsl:for-each>
			<xsl:apply-templates select="t:agentname | t:Addess1"/>
		</Row>
	</xsl:template>

	<xsl:template match="t:Response/t:Result/t:info/t:rfs">
		<fundcategory>
			<xsl:apply-templates/>
		</fundcategory>
	</xsl:template>

	<xsl:template match="t:Response/t:Result/t:info/t:code">
		<type>
			<xsl:apply-templates/>
		</type>
	</xsl:template>

	<xsl:template match="t:Response/t:Result/t:List/*">
		<xsl:element name="{local-name()}">
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>

</xsl:stylesheet>
