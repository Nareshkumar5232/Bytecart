import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Logo from "../common/Logo";

/* =========================================================
   BYTECART TEXT HOVER EFFECT
   ========================================================= */

export const TextHoverEffect = ({
  text,
  duration = 0.15,
  className,
}) => {
  const svgRef = useRef(null);

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });

  const [hovered, setHovered] = useState(false);

  const [maskPosition, setMaskPosition] = useState({
    cx: "50%",
    cy: "50%",
  });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();

      const cxPercentage =
        ((cursor.x - svgRect.left) / svgRect.width) * 100;

      const cyPercentage =
        ((cursor.y - svgRect.top) / svgRect.height) * 100;

      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 400 90"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) =>
        setCursor({
          x: e.clientX,
          y: e.clientY,
        })
      }
      className={cn(
        "select-none uppercase cursor-pointer w-full max-w-5xl mx-auto",
        className
      )}
    >
      <defs>
        {/* Warm tech-inspired gradient */}
        <linearGradient
          id="bytecartTextGradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#C08A6A" />
              <stop offset="35%" stopColor="#A66A4C" />
              <stop offset="65%" stopColor="#D2B49A" />
              <stop offset="100%" stopColor="#8B5E48" />
            </>
          )}
        </linearGradient>

        {/* Cursor reveal */}
        <motion.radialGradient
          id="bytecartRevealMask"
          gradientUnits="userSpaceOnUse"
          r="25%"
          initial={{
            cx: "50%",
            cy: "50%",
          }}
          animate={maskPosition}
          transition={{
            duration: duration ?? 0.15,
            ease: "easeOut",
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="bytecartTextMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#bytecartRevealMask)"
          />
        </mask>
      </defs>

      {/* Subtle outline while hovering */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        letterSpacing="0.12em"
        className="
          fill-transparent
          stroke-[#F5F2EC]
          font-sans
          text-5xl
          font-bold
        "
        style={{
          opacity: hovered ? 0.3 : 0.08,
        }}
      >
        {text}
      </text>

      {/* Main animated outline */}
      <motion.text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.5"
        letterSpacing="0.12em"
        className="
          fill-transparent
          stroke-[#A66A4C]
          font-sans
          text-5xl
          font-bold
        "
        initial={{
          strokeDashoffset: 1000,
          strokeDasharray: 1000,
        }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Cursor-following color reveal */}
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#bytecartTextGradient)"
        strokeWidth="0.5"
        letterSpacing="0.12em"
        mask="url(#bytecartTextMask)"
        className="
          fill-transparent
          font-sans
          text-5xl
          font-bold
        "
      >
        {text}
      </text>
    </svg>
  );
};

/* =========================================================
   FOOTER BACKGROUND
   ========================================================= */

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(
            80% 60% at 50% 0%,
            rgba(166, 106, 76, 0.14) 0%,
            rgba(166, 106, 76, 0.04) 40%,
            transparent 70%
          )
        `,
      }}
    />
  );
};

/* =========================================================
   BYTECART FOOTER
   ========================================================= */

export function HoverFooter() {
  const footerLinks = [
    {
      title: "BYTECART Categories",
      links: [
        { label: "Laptops", href: "/products?category=laptops" },
        { label: "Desktops", href: "/products?category=desktops" },
        { label: "Monitors", href: "/products?category=monitors" },
        { label: "PC Components", href: "/products?category=pc-components" },
        { label: "Accessories", href: "/products?category=accessories" },
        { label: "Gaming", href: "/products?category=gaming" },
        { label: "Storage", href: "/products?category=storage" },
        { label: "Networking", href: "/products?category=networking" },
      ],
    },
    {
      title: "Customer Support",
      links: [
        { label: "FAQs", href: "/contact?subject=FAQs" },
        { label: "Shipping", href: "/contact?subject=Shipping" },
        { label: "Returns", href: "/contact?subject=Returns" },
        { label: "Warranty", href: "/contact?subject=Warranty" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "My Orders", href: "/my-orders" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Account", href: "/account" },
        { label: "Admin Portal", href: "/admin/login" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={15} />,
      text: "bytecartpvtltd@gmail.com",
      href: "mailto:bytecartpvtltd@gmail.com",
    },
    {
      icon: <Phone size={15} />,
      text: "044 3154 4571",
      href: "tel:+914431544571",
    },
    {
      icon: <MapPin size={15} />,
      text: "Anna Nagar, Chennai – 600040",
      href: "/contact",
    },
  ];

  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#24221F]
        text-[#F5F2EC]
        rounded-3xl
        mx-3
        sm:mx-6
        lg:mx-8
        mt-16
        mb-6
        border
        border-[#3A3632]
      "
    >
      {/* Background Glow */}
      <FooterBackgroundGradient />

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          py-12
          md:px-10
          md:py-14
          lg:px-12
          space-y-12
        "
      >
        {/* =================================================
            TOP SECTION: BRAND & LINKS
            ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-12
            gap-10
            lg:gap-8
            items-start
          "
        >
          {/* BRAND (Span 4) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Logo light={true} />

            <p
              className="
                max-w-sm
                text-xs
                leading-relaxed
                text-[#BDB6AF]
                font-light
              "
            >
              Thoughtfully selected electronics for contemporary spaces, high performance, and timeless design.
            </p>

            <Link
              to="/products"
              className="
                inline-flex
                items-center
                gap-1.5
                w-fit
                text-xs
                font-medium
                text-[#F5F2EC]
                group
                border-b
                border-[#6F665F]
                pb-0.5
                transition-all
                duration-300
                hover:border-[#C08A6A]
                pt-1
              "
            >
              <span>Explore the collection</span>
              <ArrowUpRight
                size={13}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  text-[#C08A6A]
                "
              />
            </Link>
          </div>

          {/* FOOTER LINK GROUPS (Span 2 + Span 2) */}
          {footerLinks.map((section, idx) => (
            <div
              key={section.title}
              className={idx === 0 ? "lg:col-span-2" : "lg:col-span-2"}
            >
              <h4
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#C08A6A]
                  mb-4
                "
              >
                {section.title}
              </h4>

              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-1.5
                        text-xs
                        text-[#C5BEB7]
                        transition-colors
                        duration-300
                        hover:text-[#F5F2EC]
                      "
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={11}
                        className="
                          opacity-0
                          -translate-x-1
                          translate-y-1
                          transition-all
                          duration-300
                          group-hover:opacity-100
                          group-hover:translate-x-0
                          group-hover:translate-y-0
                          text-[#C08A6A]
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CONTACT DETAILS (Span 2) */}
          <div className="lg:col-span-2">
            <h4
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#C08A6A]
                mb-4
              "
            >
              Get in Touch
            </h4>

            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="
                      flex
                      items-center
                      gap-2.5
                      group
                    "
                  >
                    <span
                      className="
                        flex
                        items-center
                        justify-center
                        text-[#C08A6A]
                        transition-transform
                        duration-300
                        group-hover:scale-110
                        shrink-0
                      "
                    >
                      {item.icon}
                    </span>

                    <span
                      className="
                        text-xs
                        text-[#C5BEB7]
                        transition-colors
                        duration-300
                        group-hover:text-[#F5F2EC]
                        truncate
                      "
                    >
                      {item.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =================================================
            REGISTERED OFFICE & CONSULTATION
            ================================================= */}

        <div
          className="
            border-t
            border-[#3A3632]
            pt-6
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            "
          >
            <div className="space-y-1">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#C08A6A]
                "
              >
                Registered Office
              </p>

              <p
                className="
                  text-xs
                  leading-relaxed
                  text-[#AFA79F]
                "
              >
                Flat No. 2, Plot No. 1051, I Block, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040
              </p>
            </div>

            <Link
              to="/contact"
              className="
                group
                inline-flex
                items-center
                gap-1.5
                w-fit
                text-xs
                text-[#F5F2EC]
                border-b
                border-[#6F665F]
                pb-0.5
                transition-all
                duration-300
                hover:border-[#C08A6A]
                shrink-0
              "
            >
              <span>Contact customer support</span>
              <ArrowUpRight
                size={13}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  text-[#C08A6A]
                "
              />
            </Link>
          </div>
        </div>

        {/* =================================================
            BOTTOM COPYRIGHT & LEGAL
            ================================================= */}

        <div
          className="
            border-t
            border-[#3A3632]
            pt-6
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
            text-[11px]
            text-[#8F8983]
          "
        >
          <p>
            © {new Date().getFullYear()} BYTECART PRIVATE LIMITED. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/about"
              className="
                transition-colors
                duration-300
                hover:text-[#F5F2EC]
              "
            >
              About
            </Link>

            <Link
              to="/contact"
              className="
                transition-colors
                duration-300
                hover:text-[#F5F2EC]
              "
            >
              Privacy & Procurement
            </Link>

            <Link
              to="/contact"
              className="
                transition-colors
                duration-300
                hover:text-[#F5F2EC]
              "
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* =================================================
            LARGE BYTECART HOVER TEXT (CLEANLY SCALED)
            ================================================= */}

        <div
          className="
            pt-4
            flex
            items-center
            justify-center
            w-full
            overflow-hidden
          "
        >
          <TextHoverEffect
            text="BYTECART"
            duration={0.15}
          />
        </div>
      </div>
    </footer>
  );
}

export default HoverFooter;
