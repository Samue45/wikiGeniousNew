import { Genius } from "./Genius"
import { Category } from "./category"

export interface GeniusesCategory {
  [Category.Math]: Genius[]
  [Category.Physic]: Genius[]
  [Category.Informatic]: Genius[]
  [Category.Philosophers]: Genius[]
  [Category.Biologists]: Genius[]
  [Category.Biochemicals]: Genius[]
  [Category.Deaf]: Genius[]
}
