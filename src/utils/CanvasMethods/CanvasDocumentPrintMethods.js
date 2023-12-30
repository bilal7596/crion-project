import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const handleGeneratePDF = async (childRefs, layout) => {
  // Create a new instance of jsPDF
  let dimensions = layout === "a4" ? [210, 297] : [297, 210];
  let lcLayout = layout === "a4" ? "p" : "l";
  const pdf = new jsPDF(lcLayout, "mm", dimensions, true);

  // Get the width and height of the PDF page
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let index = 0; index < childRefs.current.length; index++) {
    const childRef = childRefs.current[index];

    // Retrieve the input element from the childRef
    const input = childRef;

    // Convert the input element to a canvas using html2canvas library
    const canvas = await html2canvas(input, { useCORS: true });

    // Get the data URL of the canvas as an image
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the scaling ratio for the image to fit in the PDF page
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    // Set the initial position of the image in the PDF
    const imgX = 0;
    const imgY = 0;

    // Add a new page for each child component, except the first one
    if (index !== 0) {
      pdf.addPage();
    }

    // Add the image to the PDF
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    // Save the PDF if it's the last child component
    if (index === childRefs.current.length - 1) {
      pdf.save("dynamicForms.pdf");
    }
  }
};
