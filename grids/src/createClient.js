import {createClient} from "@supabase/supabase-js";

export const supabase = createClient(
    "https://dththettbkvrwxhxsuso.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHRoZXR0Ymt2cnd4aHhzdXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzOTAwNjEsImV4cCI6MjAwOTk2NjA2MX0.5uahA2KG0PITYgVXahg0pQ5TlixnhMp13CjRG5hhBsY"
    )