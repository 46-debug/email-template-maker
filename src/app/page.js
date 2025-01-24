"use client"

import { useState } from "react";

const page = () => {

  const [fSize, setFSize] = useState("30px");
  const [fColor, setFColor] = useState("black");
  const [fAlignment, setFAlignment] = useState("start");

  const [tSize, setTSize] = useState("20px");
  const [tColor, setTColor] = useState("black");
  const [tAlignment, setTAlignment] = useState("start");

  const [ftSize, setFtSize] = useState("15px");
  const [ftColor, setFtColor] = useState("black");
  const [ftAlignment, setFtAlignment] = useState("start");

  const [showDownload, setShowDownload] = useState("none");

  const [showLinput, setShowLinput] = useState({ "hight": "0px", "bg": "white", "Lstatus": false });
  const [showHinput, setShowHinput] = useState({ "hight": "0px", "bg": "white", "Hstatus": false });
  const [showDinput, setShowDinput] = useState({ "hight": "0px", "bg": "white", "Dstatus": false });
  const [showIinput, setShowIinput] = useState({ "hight": "0px", "bg": "white", "Istatus": false });
  const [showFinput, setShowFinput] = useState({ "hight": "0px", "bg": "white", "Fstatus": false });

  const LogoStyle = () => {
    setShowLinput((prev) => ({
      ...prev,
      Lstatus: !prev.Lstatus,
      hight: prev.Lstatus ? "fit-content" : "0px",
      bg: prev.Lstatus ? "wheat" : "white"
    }));
    setShowHinput({ ...showHinput, hight: "0px", bg: "white" });
    setShowDinput({ ...showDinput, hight: "0px", bg: "white" });
    setShowIinput({ ...showIinput, hight: "0px", bg: "white" });
    setShowFinput({ ...showFinput, hight: "0px", bg: "white" });
  };

  const HeadingStyle = () => {
    setShowHinput((prev) => ({
      ...prev,
      Hstatus: !prev.Hstatus,
      hight: prev.Hstatus ? "fit-content" : "0px",
      bg: prev.Hstatus ? "wheat" : "white"
    }));
    setShowLinput({ ...showLinput, hight: "0px", bg: "white" });
    setShowDinput({ ...showDinput, hight: "0px", bg: "white" });
    setShowIinput({ ...showIinput, hight: "0px", bg: "white" });
    setShowFinput({ ...showFinput, hight: "0px", bg: "white" });
  };

  const DescriptionStyle = () => {
    setShowDinput((prev) => ({
      ...prev,
      Dstatus: !prev.Dstatus,
      hight: prev.Dstatus ? "fit-content" : "0px",
      bg: prev.Dstatus ? "wheat" : "white"
    }));
    setShowHinput({ ...showHinput, hight: "0px", bg: "white" });
    setShowLinput({ ...showLinput, hight: "0px", bg: "white" });
    setShowIinput({ ...showIinput, hight: "0px", bg: "white" });
    setShowFinput({ ...showFinput, hight: "0px", bg: "white" });
  };

  const ImageStyle = () => {
    setShowIinput((prev) => ({
      ...prev,
      Istatus: !prev.Istatus,
      hight: prev.Istatus ? "fit-content" : "0px",
      bg: prev.Istatus ? "wheat" : "white"
    }));
    setShowHinput({ ...showHinput, hight: "0px", bg: "white" });
    setShowLinput({ ...showLinput, hight: "0px", bg: "white" });
    setShowDinput({ ...showDinput, hight: "0px", bg: "white" });
    setShowFinput({ ...showFinput, hight: "0px", bg: "white" });
  };

  const FooterStyle = () => {
    setShowFinput((prev) => ({
      ...prev,
      Fstatus: !prev.Fstatus,
      hight: prev.Fstatus ? "fit-content" : "0px",
      bg: prev.Fstatus ? "wheat" : "white"
    }));
    setShowHinput({ ...showHinput, hight: "0px", bg: "white" });
    setShowLinput({ ...showLinput, hight: "0px", bg: "white" });
    setShowDinput({ ...showDinput, hight: "0px", bg: "white" });
    setShowIinput({ ...showIinput, hight: "0px", bg: "white" });
  };

  const [title, setTitle] = useState("Google");
  const [description, setDescription] = useState("Google is the best tool");
  const [footer, setFooter] = useState("This is footer");
  const [lShape, setLShape] = useState("100px");
  const [image, setImage] = useState('/uploads/image.png');
  const [logo, setLogo] = useState('/uploads/image.png');

  const sendDataToBackend = async () => {
    setShowDownload("block");

    // Create a FormData object to send files and data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("footer", footer);
    formData.append("lShape", lShape);
    formData.append("fSize", fSize);
    formData.append("fColor", fColor);
    formData.append("fAlignment", fAlignment);
    formData.append("tSize", tSize);
    formData.append("tColor", tColor);
    formData.append("tAlignment", tAlignment);
    formData.append("ftSize", ftSize);
    formData.append("ftColor", ftColor);
    formData.append("ftAlignment", ftAlignment);

    // Append image and logo files (if they exist)
    const logoInput = document.getElementById("Linput");
    const imageInput = document.getElementById("Iinput");

    if (logoInput.files && logoInput.files[0]) {
      formData.append("logo", logoInput.files[0]);
    }
    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    try {
      const response = await fetch("https://email-template-maker-w5ag.vercel.app/api/uploadEmailConfig", {
        method: "POST",
        body: formData, // Pass the FormData object directly
      });

      if (!response.ok) {
        console.error("Error sending data to backend:", response.statusText);
        return;
      }

      const responseData = await response.json();
      console.log("Data sent to backend successfully:", responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className='flex items-center gap-3 justify-center flex-col min-h-screen w-full'>
        <h1 className="text-xl text-center my-4">Email template preview</h1>
        <div className="flex w-full justify-center gap-2">
          <button onClick={sendDataToBackend} className="p-2 bg-green-500 rounded-xl text-white">Save</button>
          <a style={{ display: showDownload }} href="/layout.html" className="p-2 bg-blue-500 rounded-xl text-white" download="layout.html">download</a>
        </div>

        {/* Dummy HTML template for live preview */}
        <div className="shadow-xl border flex flex-col gap-5 p-3 items-center sm:px-44 w-full sm:max-w-[900px] mx-10">

          <div style={{ borderRadius: lShape }} className="w-28 h-28  flex items-center justify-center overflow-hidden border">
            <img src={logo} alt="" />
          </div>
          <h1 style={{ fontSize: fSize, color: fColor, textAlign: fAlignment }} className="w-full">{title}</h1>
          <p style={{ fontSize: tSize, color: tColor, textAlign: tAlignment }} className="w-full">{description}</p>
          <div className="w-auto overflow-hidden">
            <img className="h-auto min-h-[300px] w-[600px] object-cover" src={image} alt="" />
          </div>
          <footer style={{ fontSize: ftSize, color: ftColor, textAlign: ftAlignment }} className="w-full bg-white">{footer}</footer>
        </div>

        <div className="h-72"></div>
        <div className="p-1 sm:px-5 bg-white flex rounded-t-xl shadow-2xl border flex-col gap-2 w-full fixed bottom-0">
          <div>
            {/* Logo input */}
            <div style={{ height: showLinput.hight }} className="flex gap-3 overflow-hidden flex-wrap transition-all items-center justify-center">
              <input className="hidden" id="Linput" name="logo" type="file"
                onChange={(e) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setLogo(URL.createObjectURL(file)) } }} />
              <label htmlFor="Linput" className="bg-green-500 p-2 rounded-full flex items-center text-white sm:rounded-xl">➕Choose Logo</label>
              <label className="flex items-center gap-2 bg-gray-50 border p-2 rounded-xl text-sm">Shapes
                <button style={{ borderColor: lShape.Cborder }} onClick={() => setLShape("100px")} className="w-20 h-20 rounded-full focus:border-blue-500 border-2">Circle</button>
                <button style={{ borderColor: lShape.Sborder }} onClick={() => setLShape("0px")} className="w-20 h-20 border-2 focus:border-blue-500">Square</button>
              </label>
            </div>

            {/* Image input */}
            <div style={{ height: showIinput.hight }} className="flex gap-3 overflow-hidden flex-wrap justify-center">
              <input className="hidden" id="Iinput" name="image" type="file"
                onChange={(e) => { if (e.target.files && e.target.files[0]) { setImage(URL.createObjectURL(e.target.files[0])) } }} />
              <label htmlFor="Iinput" className="bg-green-500 p-2 rounded-full flex items-center text-white sm:rounded-xl">➕Choose Image</label>
            </div>

            {/* description input */}
            <div style={{ height: showDinput.hight }} className="flex items-center overflow-hidden justify-between flex-wrap gap-4">
              <input id="description" className="border-2 border-green-500 rounded-lg p-2 relative min-h-14 w-full" type="text" value={description}
                onChange={(e) => { setDescription(e.target.value) }} />
              {/* <label className="bg-white text-xs absolute top-1 left-6 px-1 sm:left-12 sm:top-2.5" htmlFor="description">Description</label> */}

              <div className="flex gap-3 items-end justify-start flex-wrap">
                <input id="color" className="w-10 h-10 hidden cursor-pointer" type="color" value={tColor} onChange={(e) => { setTColor(e.target.value) }} />
                <label className="h-16 w-16 bg-gradient-to-r border-2 rounded-lg border-gray-500 from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" htmlFor="color"></label>
                <div className="flex gap-2">
                  <div className="flex gap-2 flex-col cursor-pointer border p-2 rounded-xl">
                    <label className="flex">Size</label>
                    <div className="flex gap-2">
                      <span onClick={() => setTSize("15px")} className="bg-gray-100 h-10 w-10 p-2 rounded-lg border hover:bg-gray-200">Xs</span>
                      <span onClick={() => setTSize("20px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">S</span>
                      <span onClick={() => setTSize("30px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">Md</span>
                      <span onClick={() => setTSize("40px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">Lg</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-col cursor-pointer border p-2 rounded-xl">
                    <label className="flex">Allign</label>
                    <div className="flex gap-2">
                      <img onClick={() => setTAlignment("start")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_left.svg" alt="" />
                      <img onClick={() => setTAlignment("center")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_center.svg" alt="" />
                      <img onClick={() => setTAlignment("end")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_right.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heading input */}
            <div style={{ height: showHinput.hight }} className="flex items-center overflow-hidden justify-between flex-wrap gap-4">
              <input id="Heading" className="border-2 border-green-500 rounded-lg p-2 relative min-h-14 w-full" type="text" value={title}
                onChange={(e) => { setTitle(e.target.value) }} />
              {/* <label className="bg-white text-xs absolute top-1 left-6 px-1 sm:left-12 sm:top-2.5" htmlFor="description">Heading</label> */}

              <div className="flex gap-3 items-end justify-start flex-wrap">
                <input id="Hcolor" className="w-10 h-10 hidden cursor-pointer" type="color" value={fColor} onChange={(e) => { setFColor(e.target.value) }} />
                <label className="h-16 w-16 bg-gradient-to-r border-2 rounded-lg border-gray-500 from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" htmlFor="Hcolor"></label>
                <div className="flex gap-2">
                  <div className="flex gap-2 flex-col cursor-pointer border p-2 rounded-xl">
                    <label className="flex">Size</label>
                    <div className="flex gap-2">
                      <span onClick={() => setFSize("15px")} className="bg-gray-100 h-10 w-10 p-2 rounded-lg border hover:bg-gray-200">Xs</span>
                      <span onClick={() => setFSize("20px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">S</span>
                      <span onClick={() => setFSize("30px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">Md</span>
                      <span onClick={() => setFSize("40px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">Lg</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-col cursor-pointer border p-2 rounded-xl">
                    <label className="flex">Allign</label>
                    <div className="flex gap-2">
                      <img onClick={() => setFAlignment("start")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_left.svg" alt="" />
                      <img onClick={() => setFAlignment("center")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_center.svg" alt="" />
                      <img onClick={() => setFAlignment("end")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_right.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer input */}
            <div style={{ height: showFinput.hight }} className="flex items-center overflow-hidden justify-between flex-wrap gap-4">
              <input id="Footer" className="border-2 border-green-500 rounded-lg p-2 relative min-h-14 w-full" type="text" value={footer}
                onChange={(e) => { setFooter(e.target.value) }} />
              {/* <label className="bg-white text-xs absolute top-1 left-6 px-1 sm:left-12 sm:top-2.5" htmlFor="description">Footer</label> */}

              <div className="flex gap-3 items-end justify-start flex-wrap">
                <input id="Fcolor" className="w-10 h-10 hidden cursor-pointer" type="color" value={ftColor} onChange={(e) => { setFtColor(e.target.value) }} />
                <label className="h-16 w-16 bg-gradient-to-r border-2 rounded-lg border-gray-500 from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" htmlFor="Fcolor"></label>
                <div className="flex gap-2">
                  <div className="flex gap-2 flex-col cursor-pointer border p-2 rounded-xl">
                    <label className="flex">Size</label>
                    <div className="flex gap-2">
                      <span onClick={() => setFtSize("15px")} className="bg-gray-100 h-10 w-10 p-2 rounded-lg border hover:bg-gray-200">Xs</span>
                      <span onClick={() => setFtSize("20px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">S</span>
                      <span onClick={() => setFtSize("30px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">Md</span>
                      <span onClick={() => setFtSize("40px")} className="bg-gray-100 p-2 rounded-lg border hover:bg-gray-200">Lg</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-col cursor-pointer border p-2 rounded-xl">
                    <label className="flex">Allign</label>
                    <div className="flex gap-2">
                      <img onClick={() => setFtAlignment("start")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_left.svg" alt="" />
                      <img onClick={() => setFtAlignment("center")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_center.svg" alt="" />
                      <img onClick={() => setFtAlignment("end")} className="bg-gray-100 p-2 h-10 w-10 rounded-lg border hover:bg-gray-200" src="/assets/align_right.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Logo button */}
          <div className="grid grid-cols-5 gap-1 sm:gap-3 bg-white border p-1 rounded-md">
            <div style={{ background: showLinput.bg }} onClick={LogoStyle} className="bg-gray-50 cursor-pointer hover:bg-gray-100 border rounded-xl flex flex-col items-center justify-center shadow">
              <h4 className="text-xs sm:text-sm">➕</h4>
              <h1 className="sm:text-xl text-lg font-semibold">Logo</h1>
            </div>

            {/* Add heading button */}
            <div style={{ background: showHinput.bg }} onClick={HeadingStyle} className="bg-gray-50 cursor-pointer hover:bg-gray-100 border rounded-xl flex flex-col sm:p-3 items-center shadow">
              <h1 className="text-xl font-semibold">H</h1>
              <h4 className="text-xs sm:text-sm">Heading</h4>
            </div>

            {/* Add Description button */}
            <div style={{ background: showDinput.bg }} onClick={DescriptionStyle} className="bg-gray-50 cursor-pointer hover:bg-gray-100 border rounded-xl flex flex-col sm:p-3 items-center shadow">
              <h1 className="text-xl font-semibold">P</h1>
              <h4 className="text-xs sm:text-sm">Paragraph</h4>
            </div>

            {/* Add image button */}
            <div style={{ background: showIinput.bg }} onClick={ImageStyle} className="bg-gray-50 cursor-pointer hover:bg-gray-100 border rounded-xl flex flex-col items-center justify-center shadow">
              <h4 className="text-xs sm:text-sm">➕</h4>
              <h1 className="sm:text-xl text-lg font-semibold">Image</h1>
            </div>

            {/* Add footer button */}
            <div style={{ background: showFinput.bg }} onClick={FooterStyle} className="bg-gray-50 cursor-pointer hover:bg-gray-100 border rounded-xl flex flex-col sm:p-3 items-center shadow">
              <h1 className="text-xl font-semibold">F</h1>
              <h4 className="text-xs sm:text-sm">Footer</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default page;