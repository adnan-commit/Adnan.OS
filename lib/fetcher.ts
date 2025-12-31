import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";
import Education from "@/models/Education";
import ProfileImage from "@/models/ProfileImage";
import Contact from "@/models/Contact";
import Achievement from "@/models/Achievement";
import Certificate from "@/models/Certificate";
import Dsa from "@/models/Dsa";
import Resume from "@/models/Resume";
import Blog from "@/models/Blog";

export async function getPortfolioData() {
  await connectToDatabase();

  const [
    projects,
    skills,
    experience,
    education,
    photos,
    contacts,
    achievements,
    certificates,
    dsa,
    resumes,
    blogs,
  ] = await Promise.all([
    Project.find().sort({ _id: -1 }).lean(),
    Skill.find().lean(),
    Experience.find().lean(),
    Education.find().lean(),
    ProfileImage.find().lean(),
    Contact.find({ isActive: true }).lean(),
    Achievement.find().sort({ date: -1 }).lean(),
    Certificate.find().sort({ issueDate: -1 }).lean(),
    Dsa.find().lean(),
    Resume.find({ isActive: true }).sort({ _id: -1 }).lean(),
    Blog.find().sort({ date: -1 }).lean(),
  ]);

  const heroImage =
    photos.find((p: any) => p.name === "avatar1")?.imageUrl || "";

  return {
    projects: JSON.parse(JSON.stringify(projects)),
    skills: JSON.parse(JSON.stringify(skills)),
    experience: JSON.parse(JSON.stringify(experience)),
    education: JSON.parse(JSON.stringify(education)),
    heroImage,
    contacts: JSON.parse(JSON.stringify(contacts)),
    achievements: JSON.parse(JSON.stringify(achievements)),
    certificates: JSON.parse(JSON.stringify(certificates)),
    resume: JSON.parse(JSON.stringify(resumes[0] || null)),
    dsa: JSON.parse(JSON.stringify(dsa)),
    blogs: JSON.parse(JSON.stringify(blogs)),
  };
}
